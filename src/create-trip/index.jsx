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

function CreateTrip() {
  const [place, setPlace] = useState();
  const [formData, setFormData] = useState({});
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
      formData?.noOfDays > 7 ||
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
      .replace("{traveler}", formData?.noOfTravellers)
      .replace("{budget}", formData?.budget);

    console.log(Final_Prompt);

    const result = await chatSession.sendMessage(Final_Prompt);
    
    const vt = cleanTripData(result?.response?.text());
    setLoading(false);
    saveAiTrip(vt);
  };

  

  const cleanTripData = (tripData) => {
    try {
      console.log("Original Trip Data:", tripData);

      // Remove backticks and anything before the first '{'
      let cleanedData = tripData
        .replace(/`/g, "") // Remove backticks
        .replace(/^[^{]+/, "") // Remove everything before the first `{`
        .replace(/[^}]*$/, "") // Remove everything after the last `}`
        .trim();
      // Trim whitespace

      console.log("Cleaned Trip Data:", cleanedData);

      // Check if cleanedData is a valid JSON string
      if (!cleanedData.startsWith("{") || !cleanedData.endsWith("}")) {
        throw new Error("Invalid JSON structure after cleaning.");
      }

      // Parse the cleaned JSON string
      const jsonData = JSON.parse(cleanedData);

      return jsonData; // Return the parsed object
    } catch (error) {
      console.error("Error cleaning trip data:", error.message);
      return {}; // Return an empty object in case of an error
    }
  };

  

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

