import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Reviews } from "@/components/ui/review";
import { redirect } from "next/navigation";

const ReviewPage = async ({ params }: { params: { courseId: string } }) => {
  const { userId } = auth();
  if (!userId) return redirect("/");

  const course = await db.course.findUnique({
    where: { id: params.courseId },
  });

  if (!course) return redirect("/");

  const reviewsRaw = await db.review.findMany({
    where: { courseId: course.id },
    orderBy: {
      createdAt: "desc",
    },
  });
  
const reviews = reviewsRaw.map((review) => ({
  id: review.id,
  rating: review.rating,
  comment: review.comment ?? "",
  createdAt: review.createdAt.toISOString(),
  userId: review.userId, // 
  user: {
    name: review.userName,
    imageUrl: review.userImage,
  },
}));


  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-4">
        {course.title} - Student Reviews
      </h1>
      <Reviews courseId={course.id} reviews={reviews} />
    </div>
  );
};

export default ReviewPage;
