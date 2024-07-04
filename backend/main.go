package main

import (
    "encoding/json"
    "log"
    "net/http"
    "os"

    "github.com/gorilla/mux"
    "github.com/joho/godotenv"
)

type SavingsAccount struct {
    ID      string  `json:"id"`
    Balance float64 `json:"balance"`
}

var accountsList = []SavingsAccount{}

func initializeEnvironment() {
    if err := godotenv.Load(); err != nil {
        log.Print("No .env file found")
    }
}

func main() {
    r := mux.NewRouter()

    r.HandleFunc("/api/savings", getAllSavingsAccounts).Methods("GET")
    r.HandleFunc("/api/savings/{id}", getSavingsAccount).Methods("GET")
    r.HandleFunc("/api/savings", createNewSavingsAccount).Methods("POST")
    r.HandleFunc("/api/savings/{id}", updateExistingSavingsAccount).Methods("PUT")
    r.HandleFunc("/api/savings/{id}", removeSavingsAccount).Methods("DELETE")

    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }

    log.Fatal(http.ListenAndServe(":"+port, r))
}

func getAllSavingsAccounts(w http.ResponseWriter, r *http.Request) {
    writeJSONResponse(w, http.StatusOK, accountsList)
}

func getSavingsAccount(w http.ResponseWriter, r *http.Request) {
    params := mux.Vars(r)
    for _, account := range accountsList {
        if account.ID == params["id"] {
            writeJSONResponse(w, http.StatusOK, account)
            return
        }
    }
    http.NotFound(w, r)
}

func createNewSavingsAccount(w http.ResponseWriter, r *http.Request) {
    var account SavingsAccount
    if err := json.NewDecoder(r.Body).Decode(&account); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
    accountsList = append(accountsList, account)
    writeJSONResponse(w, http.StatusCreated, account)
}

func updateExistingSavingsAccount(w http.ResponseWriter, r *http.Request) {
    params := mux.Vars(r)
    for index, account := range accountsList {
        if account.ID == params["id"] {
            if err := json.NewDecoder(r.Body).Decode(&account); err != nil {
                http.Error(w, err.Error(), http.StatusBadRequest)
                return
            }
            account.ID = params["id"]
            accountsList[index] = account // update the account in-place
            writeJSONResponse(w, http.StatusOK, account)
            return
        }
    }
    http.NotFound(w, r)
}

func removeSavingsAccount(w http.ResponseWriter, r *http.Request) {
    params := mux.Vars(r)
    for index, account := range accountsList {
        if account.ID == params["id"] {
            accountsList = append(accountsList[:index], accountsList[index+1:]...)
            w.WriteHeader(http.StatusNoContent)
            return
        }
    }
    http.NotFound(w, r)
}

func writeJSONResponse(w http.ResponseWriter, statusCode int, data interface{}) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(statusCode)
    json.NewEncoder(w).Encode(data)
}

func init() {
    initializeEnvironment()
}