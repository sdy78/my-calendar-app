import {
  RegisterLink,
  LoginLink,
} from "@kinde-oss/kinde-auth-nextjs/components";

export default function Home() {
  return (
    <>
      <div className="hero bg-gradient-to-br from-primary/10 via-base-100 to-secondary/10 min-h-screen">
        <div className="hero-content text-center">
          <div className="max-w-2xl">
            {/* Animation d'entrée et icône */}
            <div className="animate-fade-in">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-lg">
                <svg 
                  className="w-10 h-10 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" 
                  />
                </svg>
              </div>
            </div>

            {/* Titre avec animation */}
            <h1 className="text-6xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4 animate-slide-up">
              App Calendar
            </h1>
            
            {/* Sous-titre */}
            <p className="text-xl text-base-content/70 mb-2 font-light">
              Organisez votre temps, maximisez votre productivité
            </p>

            {/* Description */}
            <p className="py-6 text-base-content/80 leading-relaxed text-lg">
              Découvrez une nouvelle façon de gérer votre emploi du temps. 
              Notre calendrier intuitif vous aide à planifier, organiser et 
              suivre vos événements en toute simplicité.
            </p>

            {/* Boutons avec espacement amélioré */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
              <LoginLink className="btn btn-primary btn-lg px-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                Se connecter
              </LoginLink>

              <RegisterLink className="btn btn-outline btn-lg px-8 border-2 hover:bg-base-200 hover:border-base-300 transition-all duration-300">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                S'inscrire
              </RegisterLink>
            </div>

            {/* Features en bas */}
            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="flex flex-col items-center p-4 rounded-lg bg-base-100/50 backdrop-blur-sm">
                <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium">Interface intuitive</span>
              </div>
              
              <div className="flex flex-col items-center p-4 rounded-lg bg-base-100/50 backdrop-blur-sm">
                <div className="w-8 h-8 bg-secondary/20 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-4 h-4 text-secondary" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium">Rapide et efficace</span>
              </div>
              
              <div className="flex flex-col items-center p-4 rounded-lg bg-base-100/50 backdrop-blur-sm">
                <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-4 h-4 text-accent" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="font-medium">Sécurisé</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}