const RequestsCards = ({ cardData, onCardClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {cardData.map((card, idx) => {
        const Icon = card.icon;

        return (
          <div
            key={idx}
            className={`card bg-base-200 shadow-xl border border-info/10`}
          >
            <div className="card-body">
              <div className="flex items-center gap-4">
                <Icon className={`text-${card.color}`} size={32} />
                <h2 className="card-title">{card.title}</h2>
              </div>
              <p className="text-sm text-gray-500">{card.description}</p>
              <div className="card-actions justify-start mt-4">
                <button
                  className={`btn btn-primary btn-sm w-full`}
                  onClick={() => onCardClick?.(card.status)}
                >
                  {card.buttonText}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default RequestsCards;
