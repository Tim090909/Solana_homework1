import { AppBar } from "@/components/AppBar";
import { PingButton } from "@/components/PingButton";
import Sender from "@/components/Sender";

export default function Home() {
  return (
    <div className="">
      <AppBar />
      <div className="container grid md:grid-cols-2 place-items-center my-32 mx-auto">
          <PingButton />
          <Sender />
      </div>
    </div>
  );
}
