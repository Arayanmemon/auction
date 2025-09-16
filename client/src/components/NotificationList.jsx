import React from "react";

const NotificationList = ({ notifications }) => (
  <div>
    {notifications && notifications.length > 0 ? (
      <ul className="divide-y divide-gray-200">
        {notifications.map((n) => (
          <li key={n.id} className={`py-2 ${n.read_at ? "text-gray-500" : "font-semibold"}`}>
            <div>{n.title || n.data?.auction_title}</div>
            <div className="text-xs">{n.body || n.data?.type}</div>
            <div className="text-xs text-gray-400">{new Date(n.created_at).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    ) : (
      <div className="text-gray-500 text-sm">No notifications.</div>
    )}
  </div>
);

export default NotificationList;
