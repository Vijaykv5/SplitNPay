import { NextResponse } from "next/server";
import { supabase } from "../../utils/supabaseClient";

export async function POST(request: Request) {
  try {
    const groupData = await request.json();

    const {
      groupName,
      groupPhoto,
      groupDescription,
      totalAmount,
      numberOfPeople,
      publicKey,
      splitAmount,
    } = groupData;

    // Insert the data into the Supabase table
    const { data, error } = await supabase
      .from("groups") // Ensure the table name is correct
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
      .select(); // Ensures the inserted row is returned, including the `id`

    if (error) {
      console.error("Error inserting group data:", error);
      return NextResponse.json(
        { error: "Failed to create group" },
        { status: 500 }
      );
    }

    // Extract the group ID from the inserted row
    const groupId = data[0]?.id; // `data[0]` contains the inserted row

    if (!groupId) {
      return NextResponse.json(
        { error: "Failed to retrieve group ID" },
        { status: 500 }
      );
    }
    console.log("Group-ID", groupId);

    // Respond with the group ID and success message
    return NextResponse.json(
      { message: "Group created successfully", groupId },
      { status: 200 }
     
    );
  } catch (error) {
    console.error("Error processing group creation:", error);
    return NextResponse.json(
      { error: "Failed to create group" },
      { status: 500 }
    );
  }
}
