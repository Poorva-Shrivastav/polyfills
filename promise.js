class MyPromise {
  resolvedVal;
  rejectedVal;

  isResolved = false;
  isRejected = false;
  //   thenFn;

  thenResolveChainingArray = [];
  thenRejectChainingArray = [];

  constructor(fn) {
    let resolve = (val) => {
      this.resolvedVal = val;
      this.isResolved = true;

      //!this is not true for chaining as we are using array now---------------
      //   if (typeof this.thenFn === "function") {
      //     this.thenFn(this.resolvedVal);
      //   }

      if (this.thenResolveChainingArray.length) {
        this.thenResolveChainingArray.reduce(
          (acc, cb) => cb(acc),
          this.resolvedVal
        );
      }
    };

    let reject = (val) => {
      this.rejectedVal = val;
      this.isRejected = true;

      if (this.thenRejectChainingArray.length) {
        this.thenRejectChainingArray.reduce(
          (acc, cb) => cb(acc),
          this.rejectedVal
        );
      }
    };

    fn(resolve, reject);
  }

  then(fn) {
    //!this is not true for chaining as we are using array now---------------
    // this.thenFn = cb;
    // if (this.isResolved) {
    //   this.thenFn(this.resolvedVal);
    // }

    //-----chaining-----
    this.thenResolveChainingArray.push(fn);
    if (this.isResolved) {
      this.thenResolveChainingArray.reduce(
        (acc, fn) => fn(acc),
        this.resolvedVal
      );
    }

    return this; //to retain the instance of this class
  }

  catch(fn) {
    this.thenRejectChainingArray.push(fn);
    if (this.isRejected) {
      this.thenRejectChainingArray.reduce(
        (acc, fn) => fn(acc),
        this.rejectedVal
      );
    }
    return this;
  }

  finally(fn) {
    this.thenResolveChainingArray.push(fn);

    if (this.isResolved) {
      this.thenResolveChainingArray.reduce(
        (acc, fn) => fn(acc),
        this.resolvedVal
      );
    }

    this.thenRejectChainingArray.push(fn);
    if (this.isRejected) {
      this.thenRejectChainingArray.reduce(
        (acc, fn) => fn(acc),
        this.rejectedVal
      );
    }
  }
}

// let p1 = new MyPromise((resolve) => resolve("message"));
// p1.then((val) => console.log(val));

let p2 = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(100);
    // reject("Hate you!");
  }, 1000);
});

// p2.then((data) => data * 2)
//   .then((val) => val * 2)
//   .catch((err) => `${err}😠😡`)
//   .catch((error) => error)
//   .finally((val) => console.log(val));

// 1. in synchronous operations, .then fn doesn't execute later and thenFnContext wouldn't have any context and code throws error.
//to handle that we check the typeof thenFnContext
// 2. when we do, then chaining, we need to maintain the order of the callbacks, for this we use Array
