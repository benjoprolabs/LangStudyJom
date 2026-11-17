import { Link } from 'react-router-dom';
import { useI18n } from '@/i18n/I18nProvider';
import { Button } from '@/components/ui/Button';

export function NotFound() {
  const { t } = useI18n();
  return (
    <div className="py-20 text-center">
      <p className="text-gradient text-6xl font-extrabold">404</p>
      <h1 className="mt-2 text-xl font-semibold">{t('notFound.title')}</h1>
      <Link to="/" className="mt-6 inline-block">
        <Button variant="secondary">{t('notFound.back')}</Button>
      </Link>
    </div>
  );
}
