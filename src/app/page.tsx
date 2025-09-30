import {
  RegisterLink,
  LoginLink,
} from "@kinde-oss/kinde-auth-nextjs/components";
export default function Home() {
  return (
    <>
      <div className="hero bg-base-200 min-h-screen">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">App Calendar</h1>
            <p className="py-6">
              Lorem ipsum dolor sit, amet consectetur adipisicing elit. Esse
              alias laudantium totam ullam. Nobis, quia corrupti odio id dolores
              eos quasi, numquam recusandae nesciunt, quis quisquam minus?
              Deserunt, labore suscipit?
            </p>
            <div className="flex justify-between items-center ">
              <LoginLink className="btn btn-secondary">Se connecter</LoginLink>

              <RegisterLink className="btn btn-outline">S'inscrire</RegisterLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
