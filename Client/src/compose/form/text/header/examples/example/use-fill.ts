// Components
import { useFormContext, usePopover } from 'design/components';

// Schema
import type { ComposeValues } from 'moonshot/compose/form/schema';

// Hooks
import { useTranslation } from 'design/hooks';

// Constants
import type { Example } from 'moonshot/compose/form/text/header/constants';

/** Fills the text with an example of the chosen kind, then closes. */
const useFill = (example: Example) => {
  const { t } = useTranslation('moonshot');
  const { clearErrors, getValues, setValue } = useFormContext<ComposeValues>();
  const { setOpen } = usePopover();

  return () => {
    clearErrors('root');
    setValue('text', t(`examples.${getValues('kind')}.${example}`), {
      shouldDirty: true,
      shouldValidate: true,
    });
    setOpen(false);
  };
};

export { useFill };
