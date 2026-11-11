// Schema
import type { ComposeValues } from 'moonshot/compose/form/schema';

// Components
import { useFormContext } from 'design/components';

// Hooks
import { useTranslation } from 'design/hooks';

// Constants
import { EXAMPLES } from 'moonshot/compose/form/text/header/constants';

// API
import type { Kind } from 'moonshot/api';
import { KINDS } from 'moonshot/shared/review';

// `Segmented` reports its value as a string.
const isKind = (value: string): value is Kind => {
  return (KINDS as readonly string[]).includes(value);
};

/**
 * An example nobody has touched follows the kind: the same example for the
 * new kind. Anything typed or edited, even by one character, is kept.
 */
const useSwapExample = () => {
  const { t } = useTranslation('moonshot');
  const { getValues, setValue } = useFormContext<ComposeValues>();

  return (previous: Kind, next: string) => {
    if (!isKind(next)) {
      return;
    }

    const text = getValues('text');
    const example = EXAMPLES.find((name) => {
      return t(`examples.${previous}.${name}`) === text;
    });

    if (example) {
      setValue('text', t(`examples.${next}.${example}`), {
        shouldDirty: true,
      });
    }
  };
};

export { useSwapExample };
