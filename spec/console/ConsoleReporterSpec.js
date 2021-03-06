describe("ConsoleReporter", function() {
  var out;

  beforeEach(function() {
    out = (function() {
      var output = "";
      return {
        print: function(str) {
          output += str;
        },
        getOutput: function() {
          return output;
        },
        clear: function() {
          output = "";
        }
      };
    }());
  });

  it("reports that the suite has started to the console", function() {
    var reporter = new jasmine.ConsoleReporter({
      print: out.print
    });

    reporter.jasmineStarted();

    expect(out.getOutput()).toEqual("Started\n");
  });

  it("reports a passing spec as a dot", function() {
    var reporter = new jasmine.ConsoleReporter({
      print: out.print
    });

    reporter.specDone({status: "passed"});

    expect(out.getOutput()).toEqual(".");
  });

  it("does not report a disabled spec", function() {
    var reporter = new jasmine.ConsoleReporter({
      print: out.print
    });

    reporter.specDone({status: "disabled"});

    expect(out.getOutput()).toEqual("");
  });

  it("reports a failing spec as an 'F'", function() {
    var reporter = new jasmine.ConsoleReporter({
      print: out.print
    });

    reporter.specDone({status: "failed"});

    expect(out.getOutput()).toEqual("F");
  });

  it("reports a summary when done (singluar spec and time)", function() {
    var fakeNow = jasmine.createSpy('fake Date.now'),
      reporter = new jasmine.ConsoleReporter({
        print: out.print,
        now: fakeNow
      });

    fakeNow.andReturn(500);

    reporter.jasmineStarted();
    reporter.specDone({status: "passed"});
    fakeNow.andReturn(1500);

    out.clear();
    reporter.jasmineDone();

    expect(out.getOutput()).toMatch(/1 spec, 0 failures/);
    expect(out.getOutput()).toMatch("Finished in 1 second\n");
  });

  it("reports a summary when done (pluralized specs and seconds)", function() {
    var fakeNow = jasmine.createSpy('fake Date.now'),
      reporter = new jasmine.ConsoleReporter({
        print: out.print,
        now: fakeNow
      });

    fakeNow.andReturn(500);
    reporter.jasmineStarted();
    reporter.specDone({status: "passed"});
    reporter.specDone({
      status: "failed",
      description: "with a failing spec",
      fullName: "A suite with a failing spec",
      failedExpectations: [
        {
          passed: false,
          message: "Expected true to be false.",
          expected: false,
          actual: true,
          trace: {
            stack: "foo\nbar\nbaz"
          }
        }
      ]
    });

    out.clear();

    fakeNow.andReturn(600);
    reporter.jasmineDone();

    expect(out.getOutput()).toMatch(/2 specs, 1 failure/);
    expect(out.getOutput()).toMatch("Finished in 0.1 seconds\n");
  });

  it("reports a summary when done that includes stack traces for a failing suite", function() {
    var reporter = new jasmine.ConsoleReporter({
      print: out.print
    });

    reporter.jasmineStarted();
    reporter.specDone({status: "passed"});
    reporter.specDone({
      status: "failed",
      description: "with a failing spec",
      fullName: "A suite with a failing spec",
      failedExpectations: [
        {
          passed: false,
          message: "Expected true to be false.",
          expected: false,
          actual: true,
          trace: {
            stack: "foo bar baz"
          }
        }
      ]
    });

    out.clear();

    reporter.jasmineDone();

    expect(out.getOutput()).toMatch(/foo bar baz/);
  });

  it("calls the onComplete callback when the suite is done", function() {
    var onComplete = jasmine.createSpy('onComplete'),
      reporter = new jasmine.ConsoleReporter({
        print: out.print,
        onComplete: onComplete
      });

    reporter.jasmineDone();

    expect(onComplete).toHaveBeenCalled();
  });


  describe("with color", function() {

    it("reports that the suite has started to the console", function() {
      var reporter = new jasmine.ConsoleReporter({
        print: out.print,
        showColors: true
      });

      reporter.jasmineStarted();

      expect(out.getOutput()).toEqual("Started\n");
    });

    it("reports a passing spec as a dot", function() {
      var reporter = new jasmine.ConsoleReporter({
        print: out.print,
        showColors: true
      });

      reporter.specDone({status: "passed"});

      expect(out.getOutput()).toEqual("\033[32m.\033[0m");
    });

    it("does not report a disabled spec", function() {
      var reporter = new jasmine.ConsoleReporter({
        print: out.print,
        showColors: true
      });

      reporter.specDone({status: 'disabled'});

      expect(out.getOutput()).toEqual("");
    });

    it("reports a failing spec as an 'F'", function() {
      var reporter = new jasmine.ConsoleReporter({
        print: out.print,
        showColors: true
      });

      reporter.specDone({status: 'failed'});

      expect(out.getOutput()).toEqual("\033[31mF\033[0m");
    });
  });
});
