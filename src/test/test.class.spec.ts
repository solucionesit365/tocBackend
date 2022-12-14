import { TestClass } from './test.class';

describe('TestClass', () => {
  it('should be defined', () => {
    expect(new TestClass()).toBeDefined();
  });
});
