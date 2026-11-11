import { useCallback, useMemo } from 'react';

// Routes
import { useNavigate } from 'design/router';

// API
import { createReview, explain } from 'moonshot/api';

// Schema
import { composeSchema, type ComposeValues } from './schema';

// Components
import { valibotResolver, useForm } from 'design/components';

// Hooks
import { useTranslation } from 'design/hooks';

const useCompose = () => {
  const { t } = useTranslation('moonshot');
  const navigate = useNavigate();
  const schema = useMemo(() => {
    return composeSchema(t);
  }, [t]);

  const form = useForm<ComposeValues>({
    defaultValues: { kind: 'commit', text: '' },
    resolver: valibotResolver(schema),
  });

  const onSubmit = useCallback(
    async ({ kind, text }: ComposeValues) => {
      try {
        const review = await createReview(kind, text);

        navigate(review.id);
      } catch (error) {
        form.setError('root', { message: explain(t, error) });
      }
    },
    [form, navigate, t]
  );

  return { form, onSubmit };
};

export { useCompose };
