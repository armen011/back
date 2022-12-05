const broadCast=(io,activeUsers,userIds,connectionName,data)=>{
    const socketIds=resolveUserIdsToSocketIds(userIds,activeUsers)
    socketIds.forEach((socketId)=>io.to(socketId).emit(connectionName,data))

}

const resolveUserIdsToSocketIds=(userIds,activeUsers)=>{

    const socketIds = Array.from(activeUsers, ([key, value]) => ({ key, value })).filter(({value})=>userIds.includes(value.userId)).map(({key})=>key)
  
    return socketIds
}

module.exports=broadCast