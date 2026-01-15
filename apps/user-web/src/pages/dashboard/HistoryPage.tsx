/**
 * @file HistoryPage.tsx
 * @description Check-in history page with pagination
 * @task TASK-013
 * @design_state_version 1.2.2
 */
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Loader2 } from 'lucide-react'
import { hooks } from '@/lib/api'
import { HistoryItem } from '@/components/history'
import { Button } from '@/components/ui/button'

const PAGE_SIZE = 10

// DONE(B): Added i18n support - TASK-013
export function HistoryPage(): JSX.Element {
  const { t } = useTranslation('history')
  const { t: tCommon } = useTranslation('common')
  const [page, setPage] = useState(1)
  const { data, isLoading, error } = hooks.useCheckInHistory(page, PAGE_SIZE)

  if (isLoading && page === 1) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <p className="text-red-500">{t('error.loadFailed')}</p>
        <Button onClick={() => window.location.reload()}>{tCommon('retry')}</Button>
      </div>
    )
  }

  const totalPages = data ? Math.ceil(data.total / data.pageSize) : 1
  const hasMore = data ? page < totalPages : false
  const hasPrevious = page > 1

  return (
    <div className="space-y-4 px-4 py-6">
      <h1 className="text-2xl font-bold">{t('title')}</h1>

      {!data || data.checkIns.length === 0 ? (
        <div className="rounded-lg border p-8 text-center">
          <p className="text-muted-foreground">{t('empty.title')}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {t('empty.description')}
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {data.checkIns.map((checkIn) => (
              <HistoryItem key={checkIn.id} checkIn={checkIn} />
            ))}
          </div>

          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              size="sm"
              disabled={!hasPrevious || isLoading}
              onClick={() => setPage((p) => p - 1)}
            >
              {t('pagination.previous')}
            </Button>
            <span className="text-sm text-muted-foreground">
              {t('pagination.page', { page, total: totalPages })}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={!hasMore || isLoading}
              onClick={() => setPage((p) => p + 1)}
            >
              {t('pagination.next')}
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
