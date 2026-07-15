                                                               const supabase = window.supabase;

export async function checkCourseCompletion(userId, courseId, courseName) {
    // Get all lessons for this course
    const { data: lessons, error: lessonsError } = await supabase
                                                                       .from("course_lessons")
                                                                           .select("id")
                                                                               .eq("course_id", courseId);

                                                                                 if (lessonsError) {
                                                                                     console.error("Error loading lessons:", lessonsError.message);
                                                                                         return null;
                                                                                           }

                                                                                             if (!lessons || lessons.length === 0) {
                                                                                                 return null;
                                                                                                   }

                                                                                                     // Get completed lessons
                                                                                                       const { data: progress, error: progressError } = await supabase
                                                                                                           .from("lesson_progress")
                                                                                                               .select("lesson_id")
                                                                                                                   .eq("user_id", userId)
                                                                                                                       .eq("completed", true);

                                                                                                                         if (progressError) {
                                                                                                                             console.error("Error loading progress:", progressError.message);
                                                                                                                                 return null;
                                                                                                                                   }

                                                                                                                                     const completedLessons = progress.map(item => item.lesson_id);

                                                                                                                                       const allCompleted = lessons.every(lesson =>
                                                                                                                                           completedLessons.includes(lesson.id)
                                                                                                                                             );

                                                                                                                                               if (!allCompleted) {
                                                                                                                                                   return null;
                                                                                                                                                     }

                                                                                                                                                       // Check if a certificate already exists
                                                                                                                                                         const { data: existingCertificate } = await supabase
                                                                                                                                                             .from("certificates")
                                                                                                                                                                 .select("certificate_id")
                                                                                                                                                                     .eq("user_id", userId)
                                                                                                                                                                         .eq("course_id", courseId)
                                                                                                                                                                             .maybeSingle();

                                                                                                                                                                               if (existingCertificate) {
                                                                                                                                                                                   return existingCertificate.certificate_id;
                                                                                                                                                                                     }

                                                                                                                                                                                       return await issueCertificate(userId, courseId, courseName);
                                                                                                                                                                                       }

                                                                                                                                                                                       export async function issueCertificate(userId, courseId, courseName) {
                                                                                                                                                                                         const certificateId =
                                                                                                                                                                                             `SF-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

                                                                                                                                                                                               const { error } = await supabase
                                                                                                                                                                                                   .from("certificates")
                                                                                                                                                                                                       .insert({
                                                                                                                                                                                                             user_id: userId,
                                                                                                                                                                                                                   course_id: courseId,
                                                                                                                                                                                                                         course_name: courseName,
                                                                                                                                                                                                                               certificate_id: certificateId,
                                                                                                                                                                                                                                     issued_at: new Date().toISOString(),
                                                                                                                                                                                                                                         });

                                                                                                                                                                                                                                           if (error) {
                                                                                                                                                                                                                                               console.error("Certificate creation failed:", error.message);
                                                                                                                                                                                                                                                   return null;
                                                                                                                                                                                                                                                     }

                                                                                                                                                                                                                                                       return certificateId;
                                                                                                                                                                                                                                                       }