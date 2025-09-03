'use client';

import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '../../../components/Navbar';
import { useGetModulesByCourseIdQuery } from '@/src/Redux/features/course/moduleApi';
import { useGetLecturesByCourseIdQuery } from '@/src/Redux/features/course/lectureApi';

type GroupedLectures = Record<string, Array<{
  _id?: string;
  title: string;
  description?: string;
  videoUrl?: string;
  pdfNotes?: string[];
  duration: number;
  moduleId: string;
  order?: number;
}>>;

export default function CourseLearnPage() {
  const params = useParams();
  const courseId = params.id as string;

  const { data: modules, isLoading: modulesLoading } = useGetModulesByCourseIdQuery(courseId);
  const { data: lectures, isLoading: lecturesLoading } = useGetLecturesByCourseIdQuery(courseId);

  const [search, setSearch] = useState('');
  const [expandedModuleId, setExpandedModuleId] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0); // sequential locking index

  const grouped: GroupedLectures = useMemo(() => {
    const byModule: GroupedLectures = {};
    (lectures ?? [])
      .filter((l) => l.title.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .forEach((l) => {
        if (!byModule[l.moduleId]) byModule[l.moduleId] = [];
        byModule[l.moduleId].push(l);
      });
    return byModule;
  }, [lectures, search]);

  const flatLectures = useMemo(() => {
    return [...(lectures ?? [])].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [lectures]);

  const currentLecture = flatLectures[currentIndex];
  const totalLectures = flatLectures.length;
  const progress = totalLectures ? Math.round(((currentIndex + 1) / totalLectures) * 100) : 0;

  const isLoading = modulesLoading || lecturesLoading;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Content */}
          <div className="lg:col-span-2 space-y-4">
            {/* Progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Course Progress</span>
                <span className="text-sm font-medium text-gray-900">{progress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600" style={{ width: `${progress}%` }} />
              </div>
            </div>

            {/* Player */}
            <div className="bg-white rounded-2xl shadow overflow-hidden">
              <div className="aspect-video bg-black">
                {currentLecture?.videoUrl ? (
                  <iframe
                    className="w-full h-full"
                    src={currentLecture.videoUrl.replace('watch?v=', 'embed/')}
                    title={currentLecture.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white">No video</div>
                )}
              </div>
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900">{currentLecture?.title ?? 'Select a lecture'}</h2>
                <p className="text-sm text-gray-600 mt-1">{currentLecture?.description}</p>
                <div className="flex items-center gap-3 mt-4">
                  <button
                    className="px-4 py-2 rounded-lg bg-gray-100 text-gray-800 disabled:opacity-50"
                    onClick={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
                    disabled={currentIndex === 0}
                  >
                    Previous
                  </button>
                  <button
                    className="px-4 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
                    onClick={() => setCurrentIndex((i) => Math.min(i + 1, totalLectures - 1))}
                    disabled={currentIndex >= totalLectures - 1}
                  >
                    Next
                  </button>
                </div>
                {/* PDFs */}
                {currentLecture?.pdfNotes && currentLecture.pdfNotes.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-900 mb-2">PDF Notes</h3>
                    <ul className="space-y-2">
                      {currentLecture.pdfNotes.map((url, idx) => (
                        <li key={idx}>
                          <a href={url} target="_blank" className="text-blue-600 hover:underline">Download PDF {idx + 1}</a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Modules & Lectures */}
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Search lessons..."
              className="w-full px-4 py-2 rounded-lg border border-gray-200 bg-white"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <div className="space-y-3">
              {isLoading && (
                <div className="text-gray-600">Loading modules...</div>
              )}
              {!isLoading && (modules ?? []).map((m, mIdx) => {
                const moduleId = (m as any)._id as string;
                const mLectures = grouped[moduleId] ?? [];
                const isExpanded = expandedModuleId === moduleId || (expandedModuleId === null && mIdx === 0);
                return (
                  <div key={moduleId} className="bg-white rounded-xl border">
                    <button
                      className="w-full flex items-center justify-between p-4"
                      onClick={() => setExpandedModuleId(isExpanded ? null : moduleId)}
                    >
                      <div>
                        <span className="font-semibold text-gray-900">{(m as any).title}</span>
                        <span className="ml-2 text-sm text-gray-500">{mLectures.length} lessons</span>
                      </div>
                      <span className="text-gray-400">{isExpanded ? '−' : '+'}</span>
                    </button>
                    {isExpanded && (
                      <div className="border-t">
                        {mLectures.length === 0 && (
                          <div className="p-4 text-sm text-gray-500">No lectures</div>
                        )}
                        {mLectures.map((lec: any) => {
                          const indexInFlat = flatLectures.findIndex((l) => l._id === lec._id);
                          const locked = indexInFlat > currentIndex; // sequential locking
                          const active = indexInFlat === currentIndex;
                          return (
                            <button
                              key={lec._id}
                              className={`w-full text-left px-4 py-3 flex items-center justify-between hover:bg-gray-50 ${active ? 'bg-blue-50' : ''}`}
                              disabled={locked}
                              onClick={() => setCurrentIndex(indexInFlat)}
                            >
                              <div className="flex items-center gap-3">
                                <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs ${locked ? 'bg-gray-200 text-gray-500' : active ? 'bg-blue-600 text-white' : 'bg-green-100 text-green-700'}`}>
                                  {locked ? '🔒' : active ? '▶' : '✓'}
                                </span>
                                <div>
                                  <div className="font-medium text-gray-900">{lec.title}</div>
                                  <div className="text-xs text-gray-500">{Math.round(lec.duration)} min</div>
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


