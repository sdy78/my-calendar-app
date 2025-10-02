import CalendarView from "@/components/CalendarView";

export default async function Dashboard() {
  // Simule un utilisateur connecté
  const user = {
    id: 1,
    role: "REFERENT", // ou PRESCRIPTEUR, BENEFICIAIRE
  };

  if (user.role === "BENEFICIAIRE") {
    return <CalendarView userId={user.id} />;
  }

  // Référent / Prescripteur → voir la liste des bénéficiaires
  const beneficiaries = await fetch("http://localhost:3000/api/users")
    .then((res) => res.json())
    .then((users) => users.filter((u: any) => u.role === "BENEFICIAIRE"));

  return (
    <div>
      <h1 className="text-center uppercase">Calendriers des bénéficiaires</h1>
      <div className="w-full flex justify-center h-full">
        <div className="p-1 md:p-[10%] w-full">
          {beneficiaries.map((b: any) => (
            <div key={b.id} className="mb-8">
              <h2 className="text-xl font-semibold text-center">{`${b.name} - ${b.email}`}</h2>
              <CalendarView userId={b.id} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
