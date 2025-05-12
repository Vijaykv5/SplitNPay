import { NextResponse } from "next/server";
import { supabase } from "../../utils/supabaseClient";

export async function POST(request: Request) {
  try {
    const groupData = await request.json();

    // Input validation
    if (!groupData) {
      return NextResponse.json(
        { error: "No data provided" },
        { status: 400 }
      );
    }

    const {
      groupName,
      groupPhoto,
      groupDescription,
      totalAmount,
      numberOfPeople,
      publicKey,
      splitAmount,
    } = groupData;

    // Validate required fields
    if (!groupName || !totalAmount || !numberOfPeople || !publicKey) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate numeric fields
    if (isNaN(totalAmount) || isNaN(numberOfPeople) || isNaN(splitAmount)) {
      return NextResponse.json(
        { error: "Invalid numeric values" },
        { status: 400 }
      );
    }

    console.log("Attempting to create group with data:", {
      groupName,
      totalAmount,
      numberOfPeople,
      publicKey,
    });

    // Insert the data into the Supabase table
    const { data, error } = await supabase
      .from("groups")
      .insert([
        {
          group_name: groupName,
          group_photo: groupPhoto,
          group_description: groupDescription,
          total_amount: totalAmount,
          number_of_people: numberOfPeople,
          public_key: publicKey,
          split_amount: splitAmount,
        },
      ])
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return NextResponse.json(
        { error: `Database error: ${error.message}` },
        { status: 500 }
      );
    }

    // Extract the group ID from the inserted row
    const groupId = data[0]?.id;

    if (!groupId) {
      console.error("No group ID returned from database");
      return NextResponse.json(
        { error: "Failed to retrieve group ID" },
        { status: 500 }
      );
    }

    console.log("Group created successfully with ID:", groupId);

    return NextResponse.json(
      { message: "Group created successfully", groupId },
      { status: 200 }
    );
  } catch (error) {
    console.error("Unexpected error in group creation:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred" },
      { status: 500 }
    );
  }
}
