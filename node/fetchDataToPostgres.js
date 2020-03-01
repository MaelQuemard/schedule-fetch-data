const schedule = require('node-schedule')
const fetch = require('node-fetch')
const { Pool } = require('pg')

require('dotenv').config()

const pool = new Pool({
    user: process.env.DB_POSTGRES_USER,
    host: process.env.DB_POSTGRES_HOST,
    database: process.env.DB_POSTGRES_DATABASE,
    password: process.env.DB_POSTGRES_PASSWORD,
    port: process.env.DB_POSTGRES_PORT,
})

var j = schedule.scheduleJob('0 */12 * * *', function () {
    fetch(process.env.API_URL)
        .then(result => result.json())
        .then(json => {
            
            for (const key in json) {
                const element = json[key]
                var infoTime = element.info.time.replace(' ', 'T');
                infoTime += "+02:00"
                var time = new Date(infoTime)

                pool.query('INSERT INTO node (info_type,info_system,info_status,info_inactive,info_status_reason,info_status_cpu,info_uptime,info_sync,info_time,info_note,info_profit_switch,info_name,info_version,info_groups,info_cmd,info_electricity,info_hot,info_veryHot,info_devices,info_consumption,info_os_status,info_os_sync,info_os_uptime,info_os_cpu_temp,info_os_cpu_load,info_os_freespace,info_os_freemem,info_os_localip,revenue_usd_day,revenue_usd_day_dual,revenue_usd_day_cpu,revenue_usd_week,revenue_usd_month,revenue_usd_month_dual,revenue_usd_month_cpu,revenue_btc_day,revenue_btc_week,revenue_btc_month,revenue_coin,revenue_coin_dual,revenue_coin_cpu,revenue_cprice,revenue_cprice_dual,revenue_cprice_cpu,mining_client,mining_client_version,mining_client_cpu,mining_client_cpu_version,mining_crypto,mining_crypto_dual,mining_crypto_cpu,mining_pool,mining_pool_dual,mining_pool_cpu,mining_hashrate_hashrate,mining_hashrate_hashrate_unit,mining_hashrate_hashrate_dual,mining_hashrate_hashrate_unit_dual,mining_hashrate_hashrate_cpu,mining_hashrate_hashrate_unit_cpu,mining_shares_accepted_share,mining_shares_accepted_share_dual,mining_shares_rejected_share,mining_shares_rejected_share_dual,mining_shares_accepted_share_cpu,mining_shares_rejected_share_cpu) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33, $34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44, $45, $46, $47, $48, $49, $50, $51, $52, $53, $54, $55, $56, $57, $58, $59, $60, $61, $62, $63, $64, $65, $66) RETURNING id',
                    [
                        element.info.type,
                        element.info.system,
                        element.info.status,
                        element.info.inactive,
                        element.info.status.reason,
                        element.info.status.cpu,
                        element.info.uptime,
                        element.info.sync,
                        time,
                        element.info.note,
                        element.info.profit_switch,
                        element.info.name,
                        element.info.version,
                        element.info.groups,
                        element.info.cmd,
                        element.info.electricity,
                        element.info.hot,
                        element.info.veryHot,
                        element.info.devices,
                        element.info.consumption,
                        element.info.os.status,
                        element.info.os.sync,
                        element.info.os.uptime,
                        element.info.os.cpu_temp,
                        element.info.os.cpu_load,
                        element.info.os.freespace,
                        element.info.os.freemem,
                        element.info.os.localip,
                        element.revenue.usd_day,
                        element.revenue.usd_day_dual,
                        element.revenue.usd_day_cpu,
                        element.revenue.usd_week,
                        element.revenue.usd_month,
                        element.revenue.usd_month_dual,
                        element.revenue.usd_month_cpu,
                        element.revenue.btc_day,
                        element.revenue.btc_week,
                        element.revenue.btc_month,
                        element.revenue.coin,
                        element.revenue.coin_dual,
                        element.revenue.coin_cpu,
                        element.revenue.cprice,
                        element.revenue.cprice_dual,
                        element.revenue.cprice_cpu,
                        element.mining.client,
                        element.mining.client_version,
                        element.mining.client_cpu,
                        element.mining.client_cpu_version,
                        element.mining.crypto,
                        element.mining.crypto_dual,
                        element.mining.crypto_cpu,
                        element.mining.pool,
                        element.mining.pool_dual,
                        element.mining.pool_cpu,
                        element.mining.hashrate_hashrate,
                        element.mining.hashrate_hashrate_unit,
                        element.mining.hashrate_hashrate_dual,
                        element.mining.hashrate_hashrate_unit_dual,
                        element.mining.hashrate_hashrate_cpu,
                        element.mining.hashrate_hashrate_unit_cpu,
                        element.mining.shares.accepted_share,
                        element.mining.shares.accepted_share_dual,
                        element.mining.shares.rejected_share,
                        element.mining.shares.rejected_share_dual,
                        element.mining.shares.accepted_share_cpu,
                        element.mining.shares.rejected_share_cpu
                    ], (error, results) => {
                        if (error) {
                            throw error
                        }
                        for (const hardware of element.hardware) {
                            pool.query('INSERT INTO hardware (name,temp,fan,power,powerMin,powerMax,powerStock,speed,bus,core,coreMax,memory,memoryMax,load, nodeId) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)',
                                [
                                    hardware.name,
                                    hardware.temp,
                                    hardware.fan,
                                    hardware.power,
                                    hardware.powerMin,
                                    hardware.powerMax,
                                    hardware.powerStock,
                                    hardware.speed,
                                    hardware.bus,
                                    hardware.core,
                                    hardware.coreMax,
                                    hardware.memory,
                                    hardware.memoryMax,
                                    hardware.load,
                                    results.rows[0].id
                                ], (err, res) => {
                                    if (error) {
                                        throw error
                                    }
                                })
                        }
                    })
            }
        })
});


