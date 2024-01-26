import TitleCard from '../../../components/Cards/TitleCard';

import { format, formatDistance, formatRelative, subDays } from 'date-fns';

import axios from 'axios';

const userSourceData = [
  { source: Date.now(), count: '600', conversionPercent: 10.2 },
  { source: Date.now(), count: '600', conversionPercent: 10.2 },
  { source: Date.now(), count: '600', conversionPercent: 10.2 }
];

function UserChannels({ dashboardData, getDashboardStats }) {
  let dailyList = dashboardData.dailyBonus?.dailyBonusList[0]?.dateList;

  let selected = dashboardData.dailyBonus?.dailyBonusList;
  if (dailyList) {
    dailyList = JSON.parse(dailyList);
  }

  return (
    <TitleCard title={'Daily Bonus Listing'}>
      {/** Table Data */}
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>#</th>
              <th className="normal-case">Date Time Generated</th>
              <th className="normal-case">Amount Receivable</th>
              <th className="normal-case">Action/Status</th>
            </tr>
          </thead>
          <tbody>
            {(dailyList || []).length === 0 && (
              <tr>
                <td className="text-center font-bold ml-4">No Data</td>
              </tr>
            )}
            {(dailyList || []).map((u, k) => {
              let isAlreadyRecieved = u.isRecieved;
              return (
                <tr key={k}>
                  <th>{k + 1}</th>
                  <td>{format(u.dateTimeAdded, 'MMM dd, yyyy hh:mm:ss a')}</td>
                  <td>{u.amountInPhp}</td>
                  <td>
                    {isAlreadyRecieved && (
                      <span className="text-green-500 font-bold">
                        <i class="fa-solid fa-plus mr-2"></i>
                        Php {u.amountInPhp}
                      </span>
                    )}

                    {!isAlreadyRecieved && (
                      <button
                        className="btn btn-sm"
                        disabled={isAlreadyRecieved}
                        onClick={async () => {
                          if (isAlreadyRecieved) {
                            return true;
                          }
                          let newData = dailyList.map(d => {
                            if (d.dateIdentifier === u.dateIdentifier) {
                              d.isRecieved = true;
                              d.dateTimeRecieved = Date.now();
                            }

                            return d;
                          });

                          let res = await axios({
                            method: 'POST',
                            url: 'transaction/recievedDailyBonus',
                            data: {
                              ID: selected[0].ID,
                              newData
                            }
                          });
                          getDashboardStats();
                        }}>
                        <i class="fa-regular fa-thumbs-up"></i>
                        Recieve
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </TitleCard>
  );
}

export default UserChannels;
