import React, { useMemo } from 'react';

const heavyCalculation = (num: number): number => {
  console.log('Performing heavy calculation...');
  return num * 2; 
};

const HeavyComponent: React.FC<{ num: number }> = ({ num }) => {
  const memoizedValue = useMemo(() => heavyCalculation(num), [num]);

  return <div>Result: {memoizedValue}</div>;
};
```
```typescript
function memoize(fn) {
  const cache = {};
  return function(...args) {
    const key = args.toString();
    if (cache[key]) {
      return cache[key];
    }
    cache[key] = fn(...args);
    return cache[key];
  };
}

const expensiveOperation = memoize(function(num) {
  console.log('Expensive calculation...');
  return num + 1;
});