const commonDocument = {
    title: "There APP Config Messages",
    status_messages: [
        { status_id: "601", msg: "Available" },
        { status_id: "602", msg: "Busy" },
        { status_id: "603", msg: "Can't Talk Text Only" },
        { status_id: "604", msg: "In a Meeting" },
        { status_id: "605", msg: "In Shopping" },
        { status_id: "606", msg: "In Washroom" },
        { status_id: "607", msg: "In Office" },
        { status_id: "608", msg: "Travelling" },
        { status_id: "609", msg: "With Family" },
        { status_id: "610", msg: "On a Date" },
        { status_id: "611", msg: "Having Meal" }
    ],
    contact_us_message: [
        {
            name: "There",
            address: "Aya Nagar, New Delhi, 110047",
            phone_number : "+011 87756"
        }
    ],
    notification_messages: [
        { notification_id: "601", msg: "Hello , I am available to take call now" },
        { notification_id: "602", msg: "Busy, Not Available on call now" },
        { notification_id: "602", msg: "Hello Friends , Its my holiday today so all set for Group call" },
        { notification_id: "602", msg: "Busy, Can't Talk Text Only" },

    ]


};

db.common.insert(commonDocument);
