package main_test

import (
	"context"
	"log"
	"os"
	"runtime"
	"strconv"
	"testing"
	"time"

	"fmt"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"go.mongodb.org/mongo-driver/mongo/readpref"
)

func TestAbs(t *testing.T) {
	got := 1
	if got != 1 {
		t.Errorf("Abs(-1) = %d; want 1", got)
	}
}

func BenchmarkHello(b *testing.B) {
	for i := 0; i < b.N; i++ {
		fmt.Println("hello")
	}
}
func ConnectMongo() {
	var (
		client   *mongo.Client
		mongoURL = "mongodb://datu_super_root:c74c112dc3130e35e9ac88c90d214555__strong@localhost:27127/datu_data"
	)

	// Initialize a new mongo client with options
	client, err := mongo.NewClient(options.Client().ApplyURI(mongoURL))

	// Connect the mongo client to the MongoDB server
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	err = client.Connect(ctx)

	// Ping MongoDB
	ctx, _ = context.WithTimeout(context.Background(), 10*time.Second)
	if err = client.Ping(ctx, readpref.Primary()); err != nil {
		fmt.Println(err)
	}
	collection := client.Database("datu_data").Collection("test")
	res, err := collection.InsertOne(context.Background(), bson.M{"_id": "123", "first": 345})
	if err != nil {
		fmt.Println(err)
	}
	id := res.InsertedID
	fmt.Println(id)
}

type TestData struct {
	//_id string
	first int32
}
type NestData struct {
	Item1 string `json:"item1" bson:"item1"`
}
type Trainer struct {
	ID   *primitive.ObjectID `json:"ID" bson:"_id,omitempty"`
	Name string              `json:"Name" bson:"name"`
	Age  int                 `json:"Age" bson:"age"`
	City string              `json:"Cityjson" bson:"citybson"`
	Time primitive.DateTime  `json:"time" bson:"time"`
	Nest NestData            `json:"nest" bson:"nest"`
}

func TestMongoDB(t *testing.T) {
	uri := "mongodb://datu_super_root:c74c112dc3130e35e9ac88c90d214555__strong@localhost:27127/datu_data"
	options.Client()
	client, err := mongo.NewClient(options.Client().ApplyURI(uri))
	if err != nil {
		log.Fatal(err)
	}
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	err = client.Connect(ctx)
	fmt.Println(ctx)
	defer cancel()
	collection := client.Database("datu_data").Collection("test")
	sid := "5c362f3fa2533bad3b6cf6f0"
	id, err := primitive.ObjectIDFromHex(sid)
	nest := NestData{"nest data"}
	ash := Trainer{ID: &id, Name: "Ash", Age: 10, City: "Pallet Town", Time: 1568183320768, Nest: nest}
	insertResult, err := collection.InsertOne(context.TODO(), ash)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("Inserted a single document: ", insertResult.InsertedID)
	var result Trainer
	filter := bson.D{{"name", "Ash"}}
	err = collection.FindOne(context.TODO(), filter).Decode(&result)
	if err != nil {
		log.Fatal(err)
	}
	fmt.Printf("Found a single document: %+v\n", result)

	result1 := struct {
		Name string `bson:"name"`
	}{}
	collection.FindOne(context.TODO(), filter).Decode(&result1)

	cur, err := collection.Find(context.Background(), bson.D{})
	if err != nil {
		log.Fatal(err)
	}
	defer cur.Close(context.Background())
	for cur.Next(context.Background()) {
		// To decode into a struct, use cursor.Decode()
		//result := TestData{}
		//result := &bson.D{}
		var result Trainer
		err := cur.Decode(&result)
		fmt.Println(result.ID.String())
		if err != nil {
			log.Fatal(err)
		}
		// do something with result...
		//dataList = append(dataList, result)
		// To get the raw bson bytes use cursor.Current
		//raw := cur.Current
		// do something with raw...
	}
	collection.DeleteOne(context.Background(), bson.M{"_id": insertResult.InsertedID})

	//res, err := collection.InsertOne(context.Background(), bson.M{"_id": "1234", "first": 345})
	//if err != nil {
	//	fmt.Println(err)
	//}
	//id := res.InsertedID
	//fmt.Println(id)
	//_,err=collection.DeleteOne(context.Background(),bson.M{"_id":id})
	//if err!=nil{
	//	fmt.Println(err)
	//}
	//
	//
	//cur, err := collection.Find(context.Background(), bson.D{})
	//if err != nil { log.Fatal(err) }
	//defer cur.Close(context.Background())
	//var dataList [] TestData
	//for cur.Next(context.Background()) {
	//	// To decode into a struct, use cursor.Decode()
	//	result := TestData{}
	//	//result := &bson.D{}
	//	err := cur.Decode(&result)
	//	if err != nil { log.Fatal(err) }
	//	// do something with result...
	//	//dataList = append(dataList, result)
	//	// To get the raw bson bytes use cursor.Current
	//	//raw := cur.Current
	//	// do something with raw...
	//}
	//for _,data:=range dataList{
	//	fmt.Println(data)
	//}
	//if err := cur.Err(); err != nil {
	//	fmt.Println(err)
	//}

}

func TestMain(m *testing.M) {
	runtime.GOMAXPROCS(14)
	x := runtime.NumCPU()
	fmt.Println("start test main:", x)
	os.Exit(m.Run())
}
func run(i int64) int64 {
	if i == 1 {
		return i
	} else {
		return i * run(i-1)
	}
}
func calc(i int64, c chan int64) {
	x := run(i)
	c <- x
}
func BenchmarkRoutine(b *testing.B) {
	var ch = make(chan int64)
	var i, j int64
	var n int64 = 30000
	for i = 1; i < n; i++ {
		go calc(i, ch)
	}
	var sum int64 = 0
	for j = 1; j < n; j++ {
		y := <-ch
		sum += y
		// fmt.Println(<-ch)
	}
	fmt.Println(sum)
}
func insert(ctx context.Context, collection *mongo.Collection, id int) {
	collection.InsertOne(ctx, bson.M{"_id": strconv.Itoa(id), "first": 345})
}
func delete(ctx context.Context, collection *mongo.Collection, id int) {
	collection.DeleteOne(ctx, bson.M{"_id": strconv.Itoa(id)})
}
func TestAdd(b *testing.T) {
	var (
		client   *mongo.Client
		mongoURL = "mongodb://datu_super_root:c74c112dc3130e35e9ac88c90d214555__strong@localhost:27127/datu_data"
	)

	client, _ = mongo.NewClient(options.Client().ApplyURI(mongoURL))
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	_ = client.Connect(ctx)
	collection := client.Database("datu_data").Collection("test")
	for i := 0; i < 10; i++ {
		go insert(ctx, collection, i)
	}
	for i := 0; i < 10; i++ {
		go delete(ctx, collection, i)
	}
}

func TestInsert(b *testing.T) {
	var (
		client   *mongo.Client
		mongoURL = "mongodb://datu_super_root:c74c112dc3130e35e9ac88c90d214555__strong@localhost:27127/datu_data"
	)

	client, _ = mongo.NewClient(options.Client().ApplyURI(mongoURL))
	ctx, _ := context.WithTimeout(context.Background(), 10*time.Second)
	_ = client.Connect(ctx)
	collection := client.Database("datu_data").Collection("test")
	for i := 0; i < 10; i++ {
		go insert(context.TODO(), collection, i)
	}
	for i := 0; i < 10; i++ {
		go delete(context.TODO(), collection, i)
	}
}
func TestProto