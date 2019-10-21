package redis

import (
	"fmt"
	"github.com/garyburd/redigo/redis"
	"log"
	"strconv"
	"time"
)

type Redis struct {
	RedisIp string
	RedisPort int
	ExpireTime int
	mlog *log.Logger
	RedisPool *redis.Pool
}

func GetRedis(RedisIp string, RedisPort int, ExpireTime int, mlog *log.Logger) *Redis {
	var redis Redis
	redis.mlog = mlog
	redis.RedisIp = RedisIp
	redis.RedisPort = RedisPort
	redis.ExpireTime = ExpireTime
	redis.ConnectRedis()
	return &redis
}

func (s *Redis) ConnectRedis() {
	url := s.RedisIp + ":" + strconv.Itoa(s.RedisPort)
	s.RedisPool = &redis.Pool{
		MaxIdle:     10,
		IdleTimeout: 240 * time.Second,
		Dial: func() (redis.Conn, error) {
			return redis.Dial("tcp", url)
		},
	}
}

func (s *Redis) SessionValid(SessionId string) bool {
	if SessionId == "" {
		return false
	}
	conn := s.RedisPool.Get()
	defer conn.Close()
	Future, err := redis.Int(conn.Do("EXPIRE", "session:"+SessionId, strconv.Itoa(sc.Config.ExpireTime)))
	if err != nil {
		log.Println("load session id error:" + SessionId)
		return false
	}
	if Future == 1 {
		return true
	} else {
		log.Println("session id expired:" + SessionId)
		return false
	}
}

func (s *Redis) WriteString(id string, SessionId string) {
	c, err := redis.Dial("tcp", "127.0.0.1:6379")
	if err != nil {
		fmt.Println("Connect to redis error", err)
		return
	}
	defer c.Close()

	_, err = c.Do("SET", "mykey", "superWang")
	if err != nil {
		fmt.Println("redis set failed:", err)
	}

	username, err := redis.String(c.Do("GET", "mykey"))
	if err != nil {
		fmt.Println("redis get failed:", err)
	} else {
		fmt.Printf("Get mykey: %v \n", username)
	}
}

