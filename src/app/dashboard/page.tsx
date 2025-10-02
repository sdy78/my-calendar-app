import CalendarContainer from "@/components/calendar.container";

export default async function Dashboard() {
  // Simule un utilisateur connecté
  const user = {
    id: 1,
    role: "REFERENT", // ou PRESCRIPTEUR, BENEFICIAIRE
  };

  if (user.role === "BENEFICIAIRE") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
              Mon Calendrier
            </h1>
            <p className="text-lg text-base-content/70">
              Gérez votre emploi du temps en toute simplicité
            </p>
          </div>
          <CalendarContainer userId={user.id} />
        </div>
      </div>
    );
  }

  // Référent / Prescripteur → voir la liste des bénéficiaires
  const beneficiaries = await fetch("http://localhost:3000/api/users")
    .then((res) => res.json())
    .then((users) => users.filter((u: any) => u.role === "BENEFICIAIRE"));

  return (
    <div className="min-h-screen bg-gradient-to-br from-base-100 to-base-200">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Calendriers des Bénéficiaires
          </h1>
          <p className="text-lg text-base-content/70 max-w-2xl mx-auto">
            Consultez et gérez les emplois du temps de tous vos bénéficiaires
          </p>
          <div className="mt-4 badge badge-primary badge-lg">
            {beneficiaries.length} bénéficiaire{beneficiaries.length > 1 ? 's' : ''}
          </div>
        </div>

        {/* Liste des bénéficiaires */}
        <div className="w-full">
          <div className="grid gap-8 lg:gap-12">
            {beneficiaries.map((b: any, index: number) => (
              <div 
                key={b.id} 
                className="bg-base-100 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-base-300 overflow-hidden"
              >
                {/* En-tête du bénéficiaire */}
                <div className="bg-gradient-to-r from-primary/10 to-secondary/10 px-6 py-4 border-b border-base-300">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4 mb-3 sm:mb-0">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                        {b.name?.charAt(0) || 'U'}
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold text-base-content">
                          {b.name || 'Utilisateur sans nom'}
                        </h2>
                        <p className="text-base-content/60 flex items-center gap-2">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {b.email || 'Email non renseigné'}
                        </p>
                      </div>
                    </div>
                    <div className="badge badge-outline badge-lg">
                      Bénéficiaire
                    </div>
                  </div>
                </div>

                {/* Calendrier */}
                <div className="p-6">
                  <CalendarContainer userId={b.id} />
                </div>
              </div>
            ))}
          </div>

          {/* État vide */}
          {beneficiaries.length === 0 && (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-base-200 flex items-center justify-center">
                <svg className="w-12 h-12 text-base-content/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-base-content/70 mb-2">
                Aucun bénéficiaire
              </h3>
              <p className="text-base-content/50 max-w-md mx-auto">
                Aucun bénéficiaire n'est actuellement enregistré dans le système.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}