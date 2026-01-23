import { Trophy, Clock } from 'lucide-react';

export default function Tournaments() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="card p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-xl lg:text-2xl font-bold text-gray-900 mb-1.5">Campeonatos</h1>
            <p className="text-gray-600 text-sm">Participe dos torneios e dispute prêmios incríveis</p>
          </div>
        </div>
      </div>

      {/* Em Breve Section */}
      <div className="card p-12 text-center opacity-75">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 rounded-full bg-neutral border-2 border-neutral-dark mx-auto mb-6 flex items-center justify-center">
            <Trophy className="w-10 h-10 text-gray-400" />
          </div>
          <div className="flex items-center justify-center gap-2 mb-4">
            <Clock className="w-6 h-6 text-gray-400" />
            <h2 className="text-2xl font-bold text-gray-500">Em Breve</h2>
          </div>
          <p className="text-gray-500 mb-2">
            Os campeonatos estão sendo preparados e estarão disponíveis em breve.
          </p>
          <p className="text-sm text-gray-400">
            Fique atento para não perder os próximos torneios e prêmios incríveis!
          </p>
        </div>
      </div>
    </div>
  );
}
