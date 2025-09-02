'use client';

import { useGetCourseByIdQuery } from "@/src/Redux/features/course/courseApi";
import { useParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import { toast } from "sonner";

export default function CourseDetails() {
  const params = useParams();
  const courseId = params.id as string;
  
  const { data: course, isLoading, isError } = useGetCourseByIdQuery(courseId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading course details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
            <p className="text-gray-600">The course you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      {/* Course Header */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Course Thumbnail */}
            <div className="lg:col-span-2">
              <div className="aspect-video bg-gray-200 rounded-2xl overflow-hidden">
                <img
                  src={course.thumbnail || "https://placehold.co/800x450?text=No+Image"}
                  alt={course.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Course Info & Enrollment */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
                <p className="text-gray-600 mb-4">
                  {course.description || "No description available."}
                </p>
                
                {/* Course Stats */}
                <div className="flex items-center space-x-6 text-sm text-gray-500 mb-6">
                  <span>⭐ 4.8 (120 reviews)</span>
                  <span>📚 {course.lessons || 12} lessons</span>
                  <span>⏱️ {course.duration || "2h 30m"}</span>
                </div>

                {/* Price */}
                <div className="text-3xl font-bold text-blue-600 mb-6">
                  {course.price !== undefined ? `$${course.price}` : "Free"}
                </div>

                {/* Enrollment Button */}
                <button 
                  className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors"
                  onClick={() => toast.success("Enrollment feature coming soon!")}
                >
                  Enroll Now
                </button>
              </div>

              {/* Course Features */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">What you'll get:</h3>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Lifetime access to course content
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Certificate of completion
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Access to course community
                  </li>
                  <li className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    30-day money-back guarantee
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Content */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Course Content</h2>
          <div className="space-y-4">
            {/* Static Course Modules */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Module 1: Introduction</h3>
                  <p className="text-sm text-gray-600">3 lessons • 45 min</p>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Module 2: Core Concepts</h3>
                  <p className="text-sm text-gray-600">5 lessons • 1h 15min</p>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Module 3: Advanced Topics</h3>
                  <p className="text-sm text-gray-600">4 lessons • 1h 30min</p>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900">Module 4: Final Project</h3>
                  <p className="text-sm text-gray-600">2 lessons • 45 min</p>
                </div>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Instructor Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Your Instructor</h2>
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="flex items-start space-x-6">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                <span className="text-white text-2xl font-bold">
                  {course.instructor?.name?.charAt(0) || "E"}
                </span>
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {course.instructor?.name || "Expert Instructor"}
                </h3>
                <p className="text-gray-600 mb-4">
                  {course.instructor?.title || "Course Creator & Industry Expert"}
                </p>
                <p className="text-gray-700 mb-6">
                  With over 10 years of experience in the field, our instructor brings real-world expertise 
                  and practical knowledge to help you master the concepts covered in this course.
                </p>
                
                {/* Instructor Stats */}
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">4.9</div>
                    <div className="text-sm text-gray-600">Instructor Rating</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">50+</div>
                    <div className="text-sm text-gray-600">Courses Created</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600">10K+</div>
                    <div className="text-sm text-gray-600">Students Enrolled</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Student Reviews</h2>
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-bold text-blue-600">4.8</span>
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                    <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                  </svg>
                ))}
              </div>
              <span className="text-gray-600">(120 reviews)</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Review 1 */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-500 text-sm ml-2">5.0</span>
              </div>
              <p className="text-gray-700 mb-4 italic text-sm">
                "Excellent course! The instructor explains complex concepts clearly and the practical examples are very helpful."
              </p>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-blue-600 font-semibold text-sm">A</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Alex Johnson</p>
                  <p className="text-gray-500 text-xs">2 weeks ago</p>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-500 text-sm ml-2">5.0</span>
              </div>
              <p className="text-gray-700 mb-4 italic text-sm">
                "Great value for money. The course exceeded my expectations and I learned practical skills quickly."
              </p>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-green-600 font-semibold text-sm">M</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Maria Garcia</p>
                  <p className="text-gray-500 text-xs">1 month ago</p>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                      <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-500 text-sm ml-2">4.9</span>
              </div>
              <p className="text-gray-700 mb-4 italic text-sm">
                "Well-structured content and responsive instructor support. Highly recommend for beginners."
              </p>
              <div className="flex items-center">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                  <span className="text-purple-600 font-semibold text-sm">D</span>
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">David Kim</p>
                  <p className="text-gray-500 text-xs">3 weeks ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Courses */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">You might also like</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Static Related Course Cards */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="h-40 bg-blue-100"></div>
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Advanced Web Development</h3>
                <p className="text-gray-600 text-sm mb-4">Master modern web technologies and frameworks</p>
                <div className="flex items-center justify-between">
                  <span className="text-blue-600 font-bold">$89</span>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Learn More</button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="h-40 bg-green-100"></div>
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Data Science Fundamentals</h3>
                <p className="text-gray-600 text-sm mb-4">Learn data analysis and machine learning basics</p>
                <div className="flex items-center justify-between">
                  <span className="text-blue-600 font-bold">$79</span>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Learn More</button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="h-40 bg-purple-100"></div>
              <div className="p-6">
                <h3 className="font-semibold text-gray-900 mb-2">Business Strategy</h3>
                <p className="text-gray-600 text-sm mb-4">Develop strategic thinking and planning skills</p>
                <div className="flex items-center justify-between">
                  <span className="text-blue-600 font-bold">$69</span>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">Learn More</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
