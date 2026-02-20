export function requestWithRetry(
  fn,
  { retries = 3, timeout = 5000, delay = 1000 } = {}
) {
  return new Promise((resolve, reject) => {
    const attempt = (remaining) => {
      const wrappedRequest = new Promise((innerResolve, innerReject) => {
        const timeoutId = setTimeout(
          () => innerReject(new Error("Timeout")),
          timeout
        );

        Promise.resolve()
          .then(fn)
          .then(
            (value) => {
              clearTimeout(timeoutId);
              innerResolve(value);
            },
            (error) => {
              clearTimeout(timeoutId);
              innerReject(error);
            }
          );
      });

      wrappedRequest
        .then((value) => {
          resolve(value);
        })
        .catch((error) => {
          if (remaining <= 0) {
            reject(error);
            return;
          }
          setTimeout(() => attempt(remaining - 1), delay);
        });
    };

    attempt(retries);
  });
}
