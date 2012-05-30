var data = {
    participants : [
        ["AJS","Alice JS"],
        ["AB", "Alice Browser"],
        ["BB", "Bob Browser"],
        ["BJS", "Bob JS"]
    ],
    
    data : [
        ["AJS", "AB", "pc = new PeerConnection()"],
        ["AB", "AJS", "onicechange('gathering')"],
        ["BB", "BJS", "TEST", {
             duration:2,
             advance:0
         }
        ],
        ["BJS", "BB", "TEST2", {
             duration:2,
         }
        ],

    ]
};
