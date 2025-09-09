import React from "react";

const NotificationList = ({ notifications }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-3">Notifications</h2>
      {notifications.length === 0 ? (
        <div className="text-gray-600 text-sm">No outbid alerts or winning bid notifications yet.</div>
      ) : (
        <ul className="text-gray-600 text-sm list-disc pl-5">
          {notifications.map((note, idx) => (
            <li key={idx} className="mb-2">
              <span className={note.type === "win" ? "text-green-600 font-semibold" : note.type === "outbid" ? "text-red-600 font-semibold" : ""}>
                {note.message}
              </span>
              <span className="ml-2 text-xs text-gray-400">{note.date}</span>
            </li>
          ))}
        </ul>
      )}
      <p className="text-xs text-gray-400 mt-2">Notifications will also be sent to your registered email.</p>
    </div>
  );
};

export default NotificationList;
