/** @param {NS} ns **/
export async function main(ns) {
    //The purpose of this script is to combine my delete.script and PurchaseServers.js into one package that will delete all servers when the server limit is at capacity, as well as print any 
    //errors when attempitng to purchase servers (if the server size returns infinity or is the same size as the current servers). 
    
        //Variable for ram size, using Math.pow(2, 10) to multiply into terabytes with 2^10. Remove Math.pow(2,10) for gigabytes.
        var ram = ("16" * Math.pow(2, 10) );

        var delLoop = 0;

        var servLength = ns.getPurchasedServers()

        while ( (delLoop !== 25) && (servLength.length !== 0) ) {
            let servName = servLength[delLoop]
            if ( (ns.getServerMaxRam(servName) < ram) && (ns.getPurchasedServerCost(ram) !== Number.POSITIVE_INFINITY) ){
                ns.tprint("Deleting Servers");
                ns.killall(servName);
                ns.deleteServer(servName);
                ns.tprint("Deleted " + servName + " Successfully");
                ++delLoop
            }
            else if (ns.getPurchasedServerMaxRam() >= ram){
                ns.tprint("Exsisting Server's RAM size larger than what's specified in the script")
                ns.tprint("Adjust RAM size.")
                ns.tprint("Killing Script Now")
                ns.kill("PurchaseServers.js", "home");
            }

        }
        //Variable for purchase loop.
        var i = 0
        //While loop that purchases servers until the limit is reached (25 server limit) and if 'var a' = 0 (No purchased servers).
        while ( ( i < ns.getPurchasedServerLimit() ) && (servLength == 0) ) {
            //Only purchases servers if the home server can afford it, and if the ServerCost(ram) does not return infinity. 
            if ( (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram) * 25) ) {
                //This executes the purchase command, and names the server at the same time.
                ns.purchaseServer("pserv-" + i, ram);
                //This writes to the terminal.
                ns.tprint("Purchased " + "pserv-" + i + " Successfully!");
                //++i adds 1 to the variable "i" when the loop is completed. This is what ends the loop when the server limit is reached.
                await ns.sleep(1000)
                ++i
            }
            else if (ns.getServerMoneyAvailable("home") < ns.getPurchasedServerCost(ram) * 25) {
                //1. Returns error code if ServerCost(ram) === Infinity
                if (ns.getPurchasedServerCost(ram) !== Number.POSITVE_INFINITY) {
                    ns.tprint("Need " + ((ns.getPurchasedServerCost(ram) * 25) - ns.getServerMoneyAvailable("home")) + " To Purchase All Servers.")
                    ns.tprint("Try running dontp00rman.script!\nTrying again in 1 minute.");
                    await ns.sleep(60000)
                }
                //2. Will print the money needed to complete a full purchase.
                else if (ns.getPurchasedServerCost(ram) === Number.POSITVE_INFINITY) {
                    ns.tprint("Server Size Error, cost = infinity!\nAdjust ram size. Killing script now")
                    ns.kill("PurchaseServers.js", "home");
                }

            }
        }
}
