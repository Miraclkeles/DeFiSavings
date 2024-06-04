import React, { useMemo } from 'react';

const heavyCalculation = (num: number): number => {
  console.log('Performing heavy calculation...');
  return num * 2;
};

const HeavyComponent: React.FC<{ num: number }> = ({ num }) => {
  const memoizedValue = useMemo(() => heavyCalculation(num), [num]);

  return <div>Result: {memoizedValue}</div>;
};

type Func<T extends any[], R> = (...args: T) => R;

function memoize<T extends any[], R>(fn: Func<T, R>): Func<T, R> {
  const cache: Record<string, R> = {};

  return function(...args: T): R {
    const key = args.toString();
    if (key in cache) {
      return cache[key];
    }
    const result = fn(...args);
    cache[key] = result;
    return result;
  };
}

const expensiveOperation = memoize((num: number) => {
  console.log('Expensive calculation...');
  return num + 1;
});