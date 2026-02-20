export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function sleepCancelable(ms) {
  let timer;
  const promise = new Promise((resolve) => {
    timer = setTimeout(resolve, ms);
  });

  promise.cancel = () => {
    clearTimeout(timer);
  };

  return promise;
}
