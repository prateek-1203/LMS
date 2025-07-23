import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const user = await currentUser();
   

    if (!user) return new NextResponse("Unauthorized", { status: 401 });

    

    const body = await req.json();
    const { courseId, rating, comment } = body;

    if (!courseId || !rating) {
      return new NextResponse("Missing fields", { status: 400 });
    }

    const course = await db.course.findUnique({
      where: { id: courseId },
    });
    if (!course) return new NextResponse("Course not found", { status: 404 });

    const existingReview = await db.review.findFirst({
  where: {
    courseId,
    userId,
  },
});

if (existingReview) {
  return new NextResponse("You have already submitted a review for this course.", {
    status: 400,
  });
}

    await db.review.create({
  data: {
    userId,
    userName:
      user.fullName?.trim() ||
      `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() ||
      user.username ||
      user.emailAddresses[0]?.emailAddress ||
      "Anonymous",
    userImage: user.imageUrl,
    courseId,
    rating,
    comment,
  },
});

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("REVIEW ERROR:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
