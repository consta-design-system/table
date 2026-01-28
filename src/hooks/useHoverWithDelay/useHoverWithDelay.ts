import { useMutableRef } from '@consta/uikit/useMutableRef';
import { useEffect, useRef } from 'react';

type UseHoverWithDelayProps = {
  isActive?: boolean | (() => boolean | undefined);
  refs: Array<React.RefObject<HTMLElement>>;
  onHover?: () => void;
  onBlur?: () => void;
  delay?: number;
};

export const useHoverWithDelay = (props: UseHoverWithDelayProps): void => {
  const { refs, onHover, onBlur, delay = 500, isActive } = props;
  const timeoutId = useRef<NodeJS.Timeout | null>(null);
  const isHovered = useRef(false);
  const mutableRef = useMutableRef([onHover, onBlur, isActive, delay] as const);

  useEffect(() => {
    const handleMouseEnter = () => {
      if (
        !(typeof mutableRef.current[2] === 'function'
          ? mutableRef.current[2]()
          : mutableRef.current)
      ) {
        return;
      }

      console.log('handleMouseEnter');

      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
        timeoutId.current = null;
      }

      if (!isHovered.current) {
        isHovered.current = true;
        if (mutableRef.current[0]) {
          mutableRef.current[0]();
        }
      }
    };

    const handleMouseLeave = () => {
      if (
        !(typeof mutableRef.current[2] === 'function'
          ? mutableRef.current[2]()
          : mutableRef.current)
      ) {
        return;
      }

      console.log('handleMouseLeave');

      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }

      timeoutId.current = setTimeout(() => {
        if (isHovered.current) {
          isHovered.current = false;
          if (mutableRef.current[1]) {
            mutableRef.current[1]();
          }
        }
        timeoutId.current = null;
      }, mutableRef.current[3]) as unknown as NodeJS.Timeout;
    };

    for (let i = 0; i < refs.length; i++) {
      const element = refs[i].current;
      element?.addEventListener('mouseenter', handleMouseEnter);
      element?.addEventListener('mouseleave', handleMouseLeave);
    }

    return () => {
      for (let i = 0; i < refs.length; i++) {
        const element = refs[i].current;
        element?.removeEventListener('mouseenter', handleMouseEnter);
        element?.removeEventListener('mouseleave', handleMouseLeave);
      }

      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
        timeoutId.current = null;
      }
    };
  }, [refs]);
};
