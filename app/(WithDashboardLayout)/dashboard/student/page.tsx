const StudentPage = () => {
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Welcome back 👋</h1>
                    <p className="text-sm text-muted-foreground">Here’s a quick look at your learning progress.</p>
                </div>
                <div className="flex gap-2">
                    <a href="/courses" className="inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium hover:bg-accent">
                        Browse Courses
                    </a>
                    <a href="/dashboard/student/my-courses" className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90">
                        My Courses
                    </a>
                </div>
            </div>

            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border p-4">
                    <p className="text-sm text-muted-foreground">Enrolled</p>
                    <p className="mt-2 text-2xl font-semibold">8</p>
                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div className="h-full w-[80%] bg-primary" />
                    </div>
                </div>
                <div className="rounded-xl border p-4">
                    <p className="text-sm text-muted-foreground">In Progress</p>
                    <p className="mt-2 text-2xl font-semibold">5</p>
                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div className="h-full w-[60%] bg-primary" />
                    </div>
                </div>
                <div className="rounded-xl border p-4">
                    <p className="text-sm text-muted-foreground">Completed</p>
                    <p className="mt-2 text-2xl font-semibold">3</p>
                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div className="h-full w-[35%] bg-primary" />
                    </div>
                </div>
                <div className="rounded-xl border p-4">
                    <p className="text-sm text-muted-foreground">Certificates</p>
                    <p className="mt-2 text-2xl font-semibold">2</p>
                    <div className="mt-3 flex gap-2">
                        <a href="/dashboard/student/my-courses" className="text-xs underline underline-offset-2">View</a>
                        <a href="/dashboard/student/my-reviews" className="text-xs underline underline-offset-2">Reviews</a>
                    </div>
                </div>
            </section>

            <section className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">Continue Learning</h2>
                        <a href="/dashboard/student/my-courses" className="text-sm text-primary hover:underline">See all</a>
                    </div>
                    <div className="rounded-xl border divide-y">
                        {[1, 2, 3].map((item) => (
                            <a key={item} href={`/courses/${item}/learn`} className="flex items-center gap-4 p-4 hover:bg-accent/40">
                                <div className="h-14 w-14 shrink-0 rounded-lg bg-muted" />
                                <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-medium">Course Title {item} — Module {item}</p>
                                    <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                                        <div className="h-full bg-primary" style={{ width: `${20 + item * 15}%` }} />
                                    </div>
                                </div>
                                <span className="text-xs text-muted-foreground">{20 + item * 15}%</span>
                            </a>
                        ))}
                    </div>
                </div>
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold">Quick Actions</h2>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
                        <a href="/courses" className="rounded-lg border p-4 hover:bg-accent/40">
                            <p className="font-medium">Discover new courses</p>
                            <p className="text-sm text-muted-foreground">Find topics you’re interested in</p>
                        </a>
                        <a href="/dashboard/student/my-courses" className="rounded-lg border p-4 hover:bg-accent/40">
                            <p className="font-medium">Go to My Courses</p>
                            <p className="text-sm text-muted-foreground">Manage your enrolled courses</p>
                        </a>
                        <a href="/dashboard/student/my-reviews" className="rounded-lg border p-4 hover:bg-accent/40">
                            <p className="font-medium">Write a review</p>
                            <p className="text-sm text-muted-foreground">Share your learning experience</p>
                        </a>
                    </div>
                </div>
            </section>

            <section className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Recommended For You</h2>
                    <a href="/courses" className="text-sm text-primary hover:underline">Explore</a>
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {[1, 2, 3].map((item) => (
                        <a key={item} href={`/courses/${item}`} className="rounded-xl border p-4 hover:bg-accent/40">
                            <div className="h-32 w-full rounded-lg bg-muted" />
                            <p className="mt-3 line-clamp-2 font-medium">Mastering Subject {item}</p>
                            <p className="text-sm text-muted-foreground">Beginner • 12 lessons</p>
                        </a>
                    ))}
                </div>
            </section>
        </div>
    )
}

export default StudentPage;