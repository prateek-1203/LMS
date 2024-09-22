import { NextResponse} from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    // Pass the request object to the auth function
    const { userId } = auth();
    
    // Parse the request body to get the title
    const { title } = await req.json();

    // Check if the user is authenticated
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Create a new course in the database
    const course = await db.course.create({
      data: {
        userId,
        title,
      },
    });

    // Return the created course as a JSON response
    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    // Log the error for debugging purposes
    console.error("[COURSES]", error);
    
    // Return a generic internal server error response
    return new NextResponse("Internal Server Error", { status: 500 });
  } finally {
    // Disconnect Prisma to clean up database connections
    await db.$disconnect();
  }
}
