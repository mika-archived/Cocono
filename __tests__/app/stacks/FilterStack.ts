import { IFilterStack, FilterStack } from "../../../src/main/stacks/FilterStack";

describe("FilterStack", () => {
  const title = "【YuNi×天神子兎音】クノイチでも恋がしたい / みきとP【歌ってみたコラボ】";
  let payload: any;
  let stack: IFilterStack;
  let filter: FilterStack;

  beforeAll(() => {
    payload = { content: title, };
    stack = {
      type: "filter",
      ops: "==", // tmp
      params: [{ ref: "content" }]
    };
  });

  describe("#run() with stack.ops is", () => {
    describe("==, source", () => {
      beforeAll(() => {
        stack.ops = "==";
      });

      describe("equals to target", () => {
        beforeAll(() => {
          stack.params[1] = title;
          filter = new FilterStack(stack, payload);
        });

        it("returns true", () => {
          expect(filter.run()).toBe(true);
        });
      });

      describe("not equals to target", () => {
        beforeAll(() => {
          stack.params[1] = `${title}1`;
          filter = new FilterStack(stack, payload);
        })

        it("returns false", () => {
          expect(filter.run()).toBe(false);
        });
      });
    });

    describe("!=, source", () => {
      beforeAll(() => {
        stack.ops = "!=";
      });

      describe("equals to target", () => {
        beforeAll(() => {
          stack.params[1] = title;
          filter = new FilterStack(stack, payload);
        });

        it("returns false", () => {
          expect(filter.run()).toBe(false);
        });
      });

      describe("not equals to target", () => {
        beforeAll(() => {
          stack.params[1] = `${title}1`;
          filter = new FilterStack(stack, payload);
        });

        it("returns true", () => {
          expect(filter.run()).toBe(true);
        });
      });
    })

    describe("~=, source", () => {
      beforeAll(() => {
        stack.ops = "~=";
      });

      describe("matches to target", () => {
        beforeAll(() => {
          stack.params[1] = "【歌ってみた.*】";
          filter = new FilterStack(stack, payload);
        });

        it("returns true", () => {
          expect(filter.run()).toBe(true);
        });
      });

      describe("not matches to target", () => {
        beforeAll(() => {
          stack.params[1] = "【歌ってみた】";
          filter = new FilterStack(stack, payload);
        });

        it("returns false", () => {
          expect(filter.run()).toBe(false);
        });
      });
    });
  });
});