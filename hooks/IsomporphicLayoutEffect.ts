import { useLayoutEffect, useEffect } from 'react';

export default function useIsomorphicLayoutEffect(){
    typeof window !== 'undefined' ? useLayoutEffect : useEffect;
}