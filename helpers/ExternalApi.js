async function fetchData() {
  try {
    const response = await fetch(
      "https://champagne-bandicoot-hem.cyclic.app/api/data"
    );
    if (!response) {
      throw new Error("error in getting response");
    }
    const jsonData = await response.json();
    return jsonData.data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
async function calculatingtime() {
  try {
    const data = await fetchData();
    const emailData = sortingAndRes(data);
    return emailData;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
}
calculatingtime();
function sortingAndRes(data) {
  const totalHoursByEmailAndIP = {};
  data.sort((a, b) => {
    const emailA = a.email.toLowerCase();
    const emailB = b.email.toLowerCase();
    if (emailA < emailB) {
      return -1;
    } else if (emailA > emailB) {
      return 1;
    } else {
      return 0;
    }
  });

  data.forEach((obj) => {
    const email = obj.email;
    const ip = obj.ip_address;
    const totalTime = obj.total_time;

    if (!totalHoursByEmailAndIP[email]) {
      totalHoursByEmailAndIP[email] = {};
      totalHoursByEmailAndIP[email].hours = 0;
      totalHoursByEmailAndIP[email].minutes = 0;
    }

    if (!totalHoursByEmailAndIP[email][ip]) {
      totalHoursByEmailAndIP[email][ip] = {
        hours: 0,
        minutes: 0,
      };
    }
    if (totalTime !== null) {
      const [hours, minutes] = totalTime.split(":");
      const hoursNum = parseInt(hours);
      const minutesNum = parseInt(minutes);

      totalHoursByEmailAndIP[email][ip].hours += hoursNum;
      totalHoursByEmailAndIP[email][ip].minutes += minutesNum;

      if (totalHoursByEmailAndIP[email][ip].minutes >= 60) {
        totalHoursByEmailAndIP[email][ip].hours += Math.floor(
          totalHoursByEmailAndIP[email][ip].minutes / 60
        );
        totalHoursByEmailAndIP[email][ip].minutes %= 60;
      }
      totalHoursByEmailAndIP[email].hours += hoursNum;
      totalHoursByEmailAndIP[email].minutes += minutesNum;

      if (totalHoursByEmailAndIP[email].minutes >= 60) {
        totalHoursByEmailAndIP[email].hours += Math.floor(
          totalHoursByEmailAndIP[email].minutes / 60
        );
        totalHoursByEmailAndIP[email].minutes %= 60;
      }
    }
  });
  const emailData = [];
  for (const email in totalHoursByEmailAndIP) {
    const { hours, minutes, ...ips } = totalHoursByEmailAndIP[email];
    const emailHours = { hours, minutes };
    const ipHours = ips;
    for (const ip in ipHours) {
      ipHours[ip] = JSON.stringify(ipHours[ip]);
    }
    emailData.push({ email, totalHours: emailHours, ipHours });
  }
  return emailData;
}
module.exports = { calculatingtime };
