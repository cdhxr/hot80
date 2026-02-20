export function myAll(promises) {
  return new Promise((resolve, reject) => {
    const arr = Array.from(promises);
    const results = [];
    let finished = 0;

    if (arr.length === 0) {
      resolve([]);
      return;
    }

    arr.forEach((promise, index) => {
      Promise.resolve(promise).then(
        (value) => {
          results[index] = value;
          finished += 1;
          if (finished === arr.length) {
            resolve(results);
          }
        },
        (error) => reject(error)
      );
    });
  });
}

export function myRace(promises) {
  return new Promise((resolve, reject) => {
    for (const promise of promises) {
      Promise.resolve(promise).then(resolve, reject);
    }
  });
}

export function myAllSettled(promises) {
  return new Promise((resolve) => {
    const arr = Array.from(promises);
    const results = [];
    let finished = 0;

    if (arr.length === 0) {
      resolve([]);
      return;
    }

    arr.forEach((promise, index) => {
      Promise.resolve(promise)
        .then(
          (value) => {
            results[index] = { status: "fulfilled", value };
          },
          (reason) => {
            results[index] = { status: "rejected", reason };
          }
        )
        .finally(() => {
          finished += 1;
          if (finished === arr.length) {
            resolve(results);
          }
        });
    });
  });
}

export function myAny(promises) {
  return new Promise((resolve, reject) => {
    const arr = Array.from(promises);
    const errors = [];
    let finished = 0;

    if (arr.length === 0) {
      reject(new AggregateError([], "All promises were rejected"));
      return;
    }

    arr.forEach((promise, index) => {
      Promise.resolve(promise).then(
        (value) => resolve(value),
        (reason) => {
          errors[index] = reason;
          finished += 1;
          if (finished === arr.length) {
            reject(new AggregateError(errors, "All promises were rejected"));
          }
        }
      );
    });
  });
}
