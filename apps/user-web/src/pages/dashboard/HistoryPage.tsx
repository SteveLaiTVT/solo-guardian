import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { hooks } from '@/lib/api'
import { HistoryItem } from '@/components/history'
import { Button } from '@/components/ui/button'

const PAGE_SIZE = 10

export function HistoryPage() {
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
        <p className="text-red-500">Failed to load history</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    )
  }

  const totalPages = data ? Math.ceil(data.total / data.pageSize) : 1
  const hasMore = data ? page < totalPages : false
  const hasPrevious = page > 1

  return (
    <div className="space-y-4 px-4 py-6">
      <h1 className="text-2xl font-bold">Check-in History</h1>

      {!data || data.checkIns.length === 0 ? (
        <div className="rounded-lg border p-8 text-center">
          <p className="text-muted-foreground">No check-ins yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Your check-in history will appear here
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
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={!hasMore || isLoading}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </>
      )}
    </div>
  )
}
