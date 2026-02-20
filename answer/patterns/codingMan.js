function noop() {}

export function codingMan(name, logger = console.log, scheduler = setTimeout) {
  const queue = [];

  const next = () => {
    const task = queue.shift();
    if (task) task();
  };

  const ctx = {
    eat(food) {
      queue.push(() => {
        logger(`Eat ${food}`);
        next();
      });
      return this;
    },

    sleep(seconds) {
      queue.push(() => {
        logger(`Sleep ${seconds}s...`);
        scheduler(() => {
          logger("Wake up");
          next();
        }, seconds * 1000);
      });
      return this;
    },

    sleepFirst(seconds) {
      queue.unshift(() => {
        logger(`Sleep ${seconds}s...`);
        scheduler(() => {
          logger("Wake up");
          next();
        }, seconds * 1000);
      });
      return this;
    }
  };

  queue.push(() => {
    logger(`Hi, I am ${name}`);
    next();
  });

  scheduler(() => next(), 0);

  return ctx;
}

export function codingManV2(name, logger = console.log, scheduler = setTimeout) {
  const queue = [];

  const ctx = {
    eat(food) {
      queue.push(() => {
        logger(`Eat ${food}`);
      });
      return this;
    },

    sleep(seconds) {
      queue.push(
        () =>
          new Promise((resolve) => {
            logger(`Sleep ${seconds}s...`);
            scheduler(() => {
              logger("Wake up");
              resolve();
            }, seconds * 1000);
          })
      );
      return this;
    },

    sleepFirst(seconds) {
      queue.unshift(
        () =>
          new Promise((resolve) => {
            logger(`Sleep ${seconds}s...`);
            scheduler(() => {
              logger("Wake up");
              resolve();
            }, seconds * 1000);
          })
      );
      return this;
    }
  };

  queue.push(() => {
    logger(`Hi, I am ${name}`);
  });

  scheduler(async () => {
    for (const task of queue) {
      await task();
    }
  }, 0);

  return ctx;
}

export { noop };
