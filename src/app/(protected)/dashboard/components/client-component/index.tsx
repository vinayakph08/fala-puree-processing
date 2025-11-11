"use client";

function DashboardClientComponent() {
  return (
    <div className='space-y-6'>
      {/* Desktop Header - only show on desktop since mobile has separate header */}
      <div className='md:flex items-center justify-between'>
        <div>
          <h1 className='text-2xl md:text-3xl font-bold'>
            Purée Processing Center
          </h1>
          <p className='text-sm md:text-basetext-muted-foreground'>
            Real-time Operations Dashboard
          </p>
        </div>
      </div>
    </div>
  );
}

export default DashboardClientComponent;
