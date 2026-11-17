import { useMemo, useState } from 'react';
import { BadgeCheck, CheckCircle2, CircleAlert, IdCard, Loader2, UserRound } from 'lucide-react';
import { db } from '@/db/client';
import { updateStudent, validateStudentInput, type StudentInput } from '@/db/repositories/student';
import type { Student } from '@/db/types';
import { useAutosave, type AutosaveStatus } from '@/hooks/useAutosave';
import { useStudent } from '@/hooks/useStudent';
import { useI18n } from '@/i18n/I18nProvider';
import { Card, CardHeader } from '@/components/ui/Card';
import { PageHeader } from '@/components/ui/PageHeader';
import { StudentFormFields } from './StudentFormFields';

export function ProfilePage() {
  const student = useStudent();
  const { t } = useI18n();
  if (!student) return <p className="text-sm text-muted">{t('common.loading')}</p>;
  // Re-mount the editor if a restore swaps in a different student.
  return <ProfileEditor key={student.id} student={student} />;
}

function ProfileEditor({ student }: { student: Student }) {
  const { t, formatDate } = useI18n();
  const [value, setValue] = useState<StudentInput>({
    fullName: student.fullName,
    preferredName: student.preferredName,
    email: student.email ?? '',
    bio: student.bio ?? '',
    goals: student.goals ?? '',
  });
  const errors = useMemo(() => validateStudentInput(value), [value]);
  const valid = Object.keys(errors).length === 0;
  const status = useAutosave(value, (v) => updateStudent(db, student.id, v), { enabled: valid });

  return (
    <>
      <PageHeader eyebrow={t('nav.groups.student')} title={t('profile.title')} description={t('profile.subtitle')} />
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader title={t('profile.identity')} icon={<IdCard className="h-4 w-4" />} />
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-accent text-xl font-bold text-white">
              {student.preferredName.slice(0, 1).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate font-semibold">{student.fullName}</p>
              <p className="flex items-center gap-1 text-xs text-accent">
                <BadgeCheck className="h-3.5 w-3.5" aria-hidden />
                {t('app.name')}
              </p>
            </div>
          </div>
          <dl className="space-y-3 text-sm">
            <div>
              <dt className="text-muted">{t('profile.studentNumber')}</dt>
              <dd className="font-mono font-medium" data-testid="student-number">{student.studentNumber}</dd>
            </div>
            <div>
              <dt className="text-muted">{t('profile.enrolledAt')}</dt>
              <dd>{formatDate(student.enrolledAt)}</dd>
            </div>
            <div>
              <dt className="text-muted">{t('profile.timezone')}</dt>
              <dd>{student.timezone}</dd>
            </div>
          </dl>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader
            title={t('profile.personal')}
            description={t('profile.autosaveHint')}
            icon={<UserRound className="h-4 w-4" />}
            action={<SaveIndicator status={status} />}
          />
          <StudentFormFields value={value} onChange={setValue} errors={errors} showErrors />
        </Card>
      </div>
    </>
  );
}

export function SaveIndicator({ status }: { status: AutosaveStatus }) {
  const { t } = useI18n();
  if (status === 'idle') return null;
  const map = {
    pending: { icon: <Loader2 className="h-3.5 w-3.5 animate-spin" />, text: t('common.saving'), cls: 'text-muted' },
    saving: { icon: <Loader2 className="h-3.5 w-3.5 animate-spin" />, text: t('common.saving'), cls: 'text-muted' },
    saved: { icon: <CheckCircle2 className="h-3.5 w-3.5" />, text: t('common.saved'), cls: 'text-success' },
    error: { icon: <CircleAlert className="h-3.5 w-3.5" />, text: t('common.saveFailed'), cls: 'text-danger' },
  }[status];
  return (
    <span role="status" className={`inline-flex shrink-0 items-center gap-1 text-xs ${map.cls}`}>
      {map.icon}
      {map.text}
    </span>
  );
}
