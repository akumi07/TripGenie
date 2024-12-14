import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AI_PROMPT,
  selectBudgetOptions,
  SelectTravelesList,
} from "@/constants/options";
import { chatSession } from "@/service/AIModal";
import React, { useEffect, useState } from "react";
import GooglePlacesAutocomplete from "react-google-places-autocomplete";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FcGoogle } from "react-icons/fc";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/service/firebaseConfig";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { v4 as uuidv4 } from 'uuid'; 

function CreateTrip() {
  const [place, setPlace] = useState();
  const [formData, setFormData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate=useNavigate()

  const handleChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: name === "noOfDays" ? Number(value) : value, // Convert noOfDays to a number
    });
  };

  useEffect(() => {
    console.log(formData);
  }, [formData]);

  const login = useGoogleLogin({
    onSuccess: (codeResp) => {
      console.log(codeResp);
      getUserProfile(codeResp); // Ensure you handle the response properly
    },
    onError: (error) => {
      console.error("Google Login Error:", error);
      toast("Login failed. Please try again.");
    },
  });
  

  const onGenerateTrip = async () => {
    const user = localStorage.getItem("user");
  
    if (!user) {
      setOpenDialog(true);
      return;
    }
  
    if (
      formData?.noOfDays > 5 ||
      !formData?.location ||
      !formData?.budget ||
      !formData?.noOfTravellers
    ) {
      toast(
        "Please fill all the fields and ensure the trip is less than or equal to 5 days."
      );
      return;
    }
    setLoading(true);
    const Final_Prompt = AI_PROMPT.replace(
      "{location}",
      formData?.location?.label
    )
      .replace("{totalDays}", formData?.noOfDays)
      .replace("{Traveller}", formData?.noOfTravellers)
      .replace("{budget}", formData?.budget)
      .replace("{totalDays}", formData?.noOfDays);
  
    console.log(Final_Prompt);
  
    // Sending API request to generate the trip data
    const result = await chatSession.sendMessage(Final_Prompt, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_GEMINI_API_KEY}`,
        "Content-Type": "application/json",
      },
    });
  
    console.log("API Response:", cleanTripData(result?.response?.text()));
  
    setLoading(false);
  
    // Clean the trip data before saving
    const cleanedTripData = cleanTripData(result?.response?.text());
  
    saveAiTrip(cleanedTripData);
  };
  
  // Function to clean the trip data by removing ```json markers and parsing the data
  const cleanTripData = (tripData) => {
    try {
      console.log("Original Trip Data:", tripData);  // Log the raw response to inspect
  
      // Step 1: Remove leading/trailing backticks and any unnecessary characters
      let cleanedData = tripData
        .replace(/`/g, '')
        .replace(/^[^\{]+/, '')
        // .replace(/[^ \t\n\r]/g, "")  // Remove closing ```
        .trim();                 // Remove any leading/trailing whitespace
  
      // Step 2: Replace single quotes around property names with double quotes
      // cleanedData = cleanedData.replace(/'([^']+)'(?=:)/g, '"$1"');
  
      // // Step 3: Ensure there are no stray commas or characters
      // cleanedData = cleanedData.replace(/,\s*([\]}])/g, '$1');  // Remove trailing commas before closing braces or brackets
  
      // // Step 4: Escape any unescaped double quotes inside the JSON strings
      // cleanedData = cleanedData.replace(/([^\\])"/g, '$1\\"');  // Escape any unescaped double quotes
  
      // // Step 5: Optionally remove non-printable characters that might cause parsing issues
      // cleanedData = cleanedData.replace(/[^\x20-\x7E]/g, '');  // Remove non-printable characters
  
      console.log("Cleaned Trip Data:", cleanedData);  // Log cleaned data to check its structure
  
      // Step 6: Attempt to parse the cleaned data as JSON
      const postCleanedData=cleanedData.replace(/[^ \t\n\r]/g, "");
      const jsonData = JSON.parse(postCleanedData);
      console.log("jsonData:", jsonData)
      
      // Return the cleaned data as a JavaScript object
      return jsonData;
    } catch (error) {
      console.error("Error cleaning trip data:", error);
      return {};  // Return an empty object in case of an error
    }
  };

  // const cleanTripData = (tripData) => {
  //   try {
  //     // Log the original data for inspection
  //     console.log("Original Trip Data:", tripData);
  
  //     // Step 1: Remove leading or trailing unwanted characters
  //     let cleanedData = tripData
  //       .replace(/^[^\{]+/, '') // Remove leading text before the opening brace `{`
  //       .replace(/```$/, '')    // Remove trailing backticks (if any)
  //       .trim();                // Trim any extra whitespace
  
  //     // Step 2: Remove any non-JSON characters at the end
  //     cleanedData = cleanedData.replace(/[\u0000-\u001F\u007F-\u009F]/g, ''); // Strip non-printable characters
  
  //     // Step 3: Ensure the cleaned data is valid JSON before parsing
  //     console.log("Cleaned Trip Data before JSON parsing:", cleanedData); // Log cleaned data for verification
  
  //     // Parse the cleaned data
  //     const jsonData = JSON.parse(cleanedData);
  
  //     // Return the cleaned data as a JavaScript object
  //     return jsonData;
  //   } catch (error) {
  //     console.error("Error cleaning trip data:", error);
  //     return {};  // Return an empty object if an error occurs
  //   }
  // };
  
  
  
  
  
  
  const saveAiTrip = async (TripData) => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const docId = Date.now().toString();
  
      await setDoc(doc(db, "AiTrips", docId), {
        userSelection: formData,
        tripData: TripData, // Save the cleaned trip data
        userEmail: user?.email,
        id: docId,
      });
  
      navigate(`/view-trip/${docId}`);
    } catch (error) {
      console.error("Error saving AI trip:", error);
    } finally {
      setLoading(false);
    }
  };
  










  const getUserProfile = (tokenInfo) => {
    axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo?.access_token}`,
            Accept: "application/json",
          },
        }
      )
      .then((res) => {
        console.log(res);
        localStorage.setItem("user", JSON.stringify(res.data)); // Save user info in localStorage
        setOpenDialog(false);
        onGenerateTrip(); // Call to generate the trip after saving the user
      })
      .catch((error) => {
        console.error("Error fetching user profile:", error);
        toast("Failed to fetch user profile. Please try again.");
      });
  };
  
  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10">
      <h2 className="font-bold text-3xl">
        Tell us your travel preferences 🏕️🌴
      </h2>
      <p className="mt-3 text-gray-500 text-xl">
        Just provide some basic information, and our trip planner will generate
        a customized itinerary based on your preferences. What is destination of
        choice?
      </p>
      <div className="mt-20 flex flex-col gap-10">
        <div>
          <h2 className="text-xl my-3 font-medium">
            What is destination of choice?
          </h2>
          <GooglePlacesAutocomplete
            apiKey={import.meta.env.VITE_GOOGLE_PLACE_API_KEY}
            selectProps={{
              place,
              onChange: (v) => {
                setPlace(v);
                handleChange("location", v);
              },
            }}
          />
        </div>
      </div>
      <div>
        <div>
          <h2 className="text-xl my-3 font-medium">
            How many days are you planning your trip?
          </h2>
          <Input
            placeholder={"Ex.3"}
            type="number"
            onChange={(e) => handleChange("noOfDays", e.target.value)}
          />
        </div>
      </div>
      <div>
        <h2 className="text-xl my-3 font-medium">What is Your Budget?</h2>
        <div className="grid grid-cols-3 gap-5 mt-5">
          {selectBudgetOptions.map((item, index) => (
            <div
              key={index}
              className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg ${
                formData?.budget === item.title ? "shadow-lg border-black" : ""
              }`}
              onClick={() => handleChange("budget", item.title)}
            >
              <h2 className="text-4xl">{item.icon}</h2>
              <h2 className="font-bold text-lg">{item.title}</h2>
              <h2 className="text-sm text-gray-500 ">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-xl my-3 font-medium">
          Who do you plan on traveling with on your next adventure?
        </h2>
        <div className="grid grid-cols-3 gap-5 mt-5">
          {SelectTravelesList.map((item, index) => (
            <div
              key={index}
              onClick={() => handleChange("noOfTravellers", item.person)}
              className={`p-4 border cursor-pointer rounded-lg hover:shadow-lg ${
                formData?.noOfTravellers === item.person
                  ? "shadow-lg border-black"
                  : ""
              }`}
            >
              <h2 className="text-4xl">{item.icon}</h2>
              <h2 className="font-bold text-lg">{item.title}</h2>
              <h2 className="text-sm text-gray-500 ">{item.desc}</h2>
            </div>
          ))}
        </div>
      </div>
      <div className="my-10 flex justify-end">
      <Button disabled={loading} onClick={onGenerateTrip}>
  {loading ? (
    <AiOutlineLoading3Quarters className="h-7 w-7 animate-spin" />
  ) : (
    "Generate Trip"
  )}
  
</Button>
      </div>
      <Dialog open={openDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <img src="/logo.svg" />
              <h2 className="font-bold text-lg mt-7">Sign In With Google</h2>
              <p className="mt-5">
                Sign In To The App With Google Authentication
              </p>
              <Button
                varient="outline"
                className="mt-7 w-full flex gap-4 items-center"
                onClick={login}
              >
                <FcGoogle /> Sign In
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CreateTrip;
