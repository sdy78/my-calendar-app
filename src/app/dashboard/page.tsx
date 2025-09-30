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
      <h1>Calendriers des bénéficiaires</h1>
      {beneficiaries.map((b: any) => (
        <div key={b.id} className="mb-8">
          <h2>{b.name || b.email}</h2>
          <CalendarView userId={b.id} />
        </div>
      ))}
    </div>
  );
}
