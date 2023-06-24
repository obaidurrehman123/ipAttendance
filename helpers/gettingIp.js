// getting user ip function
const os = require("os");
const getuserIp = async () => {
  try {
    const interfaces = os.networkInterfaces();
    let deviceIpAddress;
    for (const interfaceName in interfaces) {
      const networkInterface = interfaces[interfaceName];
      for (const interfaceInfo of networkInterface) {
        if (interfaceInfo.family === "IPv4" && !interfaceInfo.internal) {
          deviceIpAddress = interfaceInfo.address;
          break;
        }
      }
      if (deviceIpAddress) {
        break;
      }
    }
    return deviceIpAddress;
  } catch (error) {
    console.error(error);
    throw new Error("Error retrieving IP address");
  }
};

module.exports = { getuserIp };
