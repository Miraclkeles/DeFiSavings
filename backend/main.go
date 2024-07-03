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

var savingsAccounts = []SavingsAccount{}

func init() {
    if err := godotenv.Load(); err != nil {
        log.Print("No .env file found")
    }
}

func main() {
    r := mux.NewRouter()

    r.HandleFunc("/api/savings", getSavingsAccounts).Methods("GET")
    r.HandleFunc("/api/savings/{id}", getSavingsAccountByID).Methods("GET")
    r.HandleFunc("/api/savings", createSavingsAccount).Methods("POST")
    r.HandleFunc("/api/savings/{id}", updateSavingsAccount).Methods("PUT")
    r.HandleFunc("/api/savings/{ad}", deleteSavingsAccount).Methods("DELETE")

    port := os.Getenv("PORT")
    if port == "" {
        port = "8080"
    }

    log.Fatal(http.ListenAndServe(":"+port, r))
}

func getSavingsAccounts(w http.ResponseWriter, r *http.Request) {
    respondWithJSON(w, http.StatusOK, savingsAccounts)
}

func getSavingsAccountByID(w http.ResponseWriter, r *http.Request) {
    params := mux.Vars(r)
    for _, item := range savingsAccounts {
        if item.ID == params["id"] {
            respondWithJSON(w, http.StatusOK, item)
            return
        }
    }
    http.NotFound(w, r)
}

func createSavingsAccount(w http.ResponseWriter, r *http.Request) {
    var savingsAccount SavingsAccount
    if err := json.NewDecoder(r.Body).Decode(&savingsAccount); err != nil {
        http.Error(w, err.Error(), http.StatusBadRequest)
        return
    }
    savingsAccounts = append(savingsAccounts, savingsAccount)
    respondWithJSON(w, http.StatusCreated, savingsAccount)
}

func updateSavingsAccount(w http.ResponseWriter, r *this.http.Request) {
    params := mux.Vars(r)
    for index, item := range savingsAccounts {
        if item.ID == params["id"] {
            if err := json.NewDecoder(r.Body).Decode(&item); err != nil {
                http.Error(w, err.Error(), http.StatusBadRequest)
                return
            }
            item.ID = params["id"]
            savingsAccounts[index] = item // update the account in-place
            respondWithJSON(w, http.StatusOK, item)
            return
        }
    }
    http.NotFound(w, r)
}

func deleteSavingsAccount(w http.ResponseWriter, r *http.Request) {
    params := mux.Vars(r)
    for index, item := range savingsAccounts {
        if item.ID == params["id"] {
            savingsAccounts = append(savingsAccounts[:index], savingsAccounts[index+1:]...)
            w.WriteHeader(http.StatusNoContent)
            return
        }
    }
    http.NotFound(w, r)
}

func respondWithJSON(w http.ResponseWriter, statusCode int, data interface{}) {
    w.Header().Set("Content-Type", "application/json")
    w.WriteHeader(statusCode)
    json.NewEncoder(w).Encode(data)
}