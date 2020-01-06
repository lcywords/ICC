package redis

import (
	"fmt"
	"github.com/garyburd/redigo/redis"
	"strconv"
	"time"
)

type Redis struct {
	RedisIp string
	RedisPort int
	ExpireTime int
	RedisPool *redis.Pool
}

func GetRedis(RedisIp string, RedisPort int, ExpireTime int) *Redis {
	var redis Redis
	redis.RedisIp = RedisIp
	redis.RedisPort = RedisPort
	redis.ExpireTime = ExpireTime
	redis.InitRedis()
	return &redis
}

func (s *Redis) InitRedis() {
	url := s.RedisIp + ":" + strconv.Itoa(s.RedisPort)
	s.RedisPool = &redis.Pool{
		MaxIdle:     256,
		MaxActive:   0,
		IdleTimeout: time.Duration(120),
		Dial: func() (redis.Conn, error) {
			return redis.Dial(
				"tcp",
				url,
				redis.DialReadTimeout(time.Duration(1000)*time.Millisecond),
				redis.DialWriteTimeout(time.Duration(1000)*time.Millisecond),
				redis.DialConnectTimeout(time.Duration(1000)*time.Millisecond),
				redis.DialDatabase(0),
				//red.DialPassword(""),
			)
		},
	}
}

// Exec("set","hello","world")
// Exec("get","hello")
func (s *Redis) ExecRedis(cmd string, key interface{}, args ...interface{}) (interface{}, error) {
	con := s.RedisPool.Get()
	if err := con.Err(); err != nil {
		return nil, err
	}
	defer con.Close()
	parmas := make([]interface{}, 0)
	parmas = append(parmas, key)

	if len(args) > 0 {
		for _, v := range args {
			parmas = append(parmas, v)
		}
	}
	return con.Do(cmd, parmas...)
}

func (s *Redis) TestRedis()  {
	// testRedis
	s.ExecRedis("set","hello","world")
	result,err := s.ExecRedis("get","hello")
	if err != nil {
		fmt.Print(err.Error())
	}
	str,_:=redis.String(result,err)
	fmt.Print(str)
}

